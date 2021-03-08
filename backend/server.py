from twisted.web.static import File
from twisted.web.server import Site
from twisted.internet import reactor
from src.colorifix_test.ServerProtocol import ServerProtocol

from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.resource import WebSocketResource


def startReactor():
    """
    Start Reactor, which passes requests to a number of known functions
    """
    # serve files from this root
    root = File(u".")

    # create the WebSocket on /forms
    factory = WebSocketServerFactory(u"ws://127.0.0.1:8088")
    factory.protocol = ServerProtocol
    resource = WebSocketResource(factory)
    root.putChild(b"forms", resource)

    # start Reactor and listen on port 8088
    site = Site(root)
    print('* Listening to port 8088')
    reactor.listenTCP(8088, site)
    reactor.run()


if __name__ == "__main__":
    # start Reactor
    startReactor()
