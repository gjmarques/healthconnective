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
        print('data')
        key = RSA.importKey(open('key.pem').read())
        print('key')
        h = SHA.new(data=data['prescription'].encode('utf-8'))
        print('h')
        signer = PKCS1_v1_5.new(key)
        print('signer')
        signature = signer.sign(h)
        print('signature')
        string = b64encode(signature).decode('utf-8')
        print('string')
    
    except (KeyError, TypeError, ValueError):
        raise JsonError(description='Invalid value.')
    return json_response(prescription=data['prescription'], signature=string)


@app.route("/validate", methods=["POST"])
def validate_signature():
    data = request.get_json(force=True)
    try:
        signature = b64decode(data['signature'].encode('utf-8'))
        key = RSA.importKey(open('cert.pem').read())
        h = SHA.new(data=data['prescription'].encode('utf-8'))
        verifier = PKCS1_v1_5.new(key)

    except (KeyError, TypeError, ValueError):
        raise JsonError(description='Invalid value.')
    return json_response(valid=verifier.verify(h, signature))