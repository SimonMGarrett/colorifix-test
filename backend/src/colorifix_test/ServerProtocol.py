from autobahn.twisted.websocket import WebSocketServerProtocol
from src.colorifix_test.FormMethods import FormMethods
import json


class ServerProtocol(WebSocketServerProtocol):
    """
    Defines our protocol for the Websocket
    """

    def __init__(self):
        super().__init__()
        self.form_methods = FormMethods()

    def onConnect(self, request):
        print("-- Colorifix forms connected: {}".format(request))
        print(' ')

    def onMessage(self, payload, isBinary):
        method = json.loads(payload)['method']
        params = json.loads(payload)['params']
        # print("-- Message:", method)
        # print('\n')

        response = self.form_methods.apply_method(method, params)
        self.sendMessage(bytes(json.dumps(response), 'utf-8'))
