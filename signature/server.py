import qrcode
import base64
from PIL import Image
from io import BytesIO
from flask import Flask, request
from flask_json import FlaskJSON, JsonError, json_response
from Cryptodome.Signature import PKCS1_v1_5
from Cryptodome.Cipher import PKCS1_OAEP
from Cryptodome.Hash import SHA
from Cryptodome.PublicKey import RSA
from Cryptodome import Random
from base64 import b64encode, b64decode
from OpenSSL.crypto import load_certificate, load_crl, FILETYPE_ASN1, FILETYPE_PEM, Error, X509Store, X509StoreContext,\
    X509StoreFlags, X509StoreContextError

app = Flask(__name__)
FlaskJSON(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route("/sign", methods=["POST"])
def sign_data():
    data = request.get_json(force=True)
    try:
        key = RSA.importKey(open('key.pem').read())
        h = SHA.new(data=data['prescription'].encode('utf-8'))
        signer = PKCS1_v1_5.new(key)
        signature = signer.sign(h)
        string = b64encode(signature).decode('utf-8')
        img = qrcode.make(json_response(prescription=data['prescription'], signature=string))
        img.save("sample.png")
        with open("sample.png", "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
    except (KeyError, TypeError, ValueError):
        raise JsonError(description='Invalid value.')
    return encoded_string


@app.route("/validate", methods=["POST"])
def validate_signature():
    data = request.get_json(force=True)
    try:
        # signature = b64decode(data['signature'].encode('utf-8'))
        # key = RSA.importKey(open('cert.pem').read())
        # h = SHA.new(data=data['prescription'].encode('utf-8'))
        # verifier = PKCS1_v1_5.new(key)

        im = Image.open(BytesIO(base64.b64decode(data['image'])))
        im.save('verify.png', 'PNG')


    except (KeyError, TypeError, ValueError):
        raise JsonError(description='Invalid value.')
    return json_response(valid=True)            # verifier.verify(h, signature))