if (typeof MessageChannel === "undefined") {
  class MockMessagePort {
    onmessage: ((event: MessageEvent) => void) | undefined;
    onmessageerror: ((event: MessageEvent) => void) | undefined;

    close() {}
    postMessage(_message: unknown, _transfer: Transferable[] = []) {}
    start() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent(_event: Event) {
      return false;
    }
  }

  class MockMessageChannel {
    port1: MockMessagePort;
    port2: MockMessagePort;

    constructor() {
      this.port1 = new MockMessagePort();
      this.port2 = new MockMessagePort();
    }
  }

  globalThis.MessageChannel = MockMessageChannel as unknown as typeof MessageChannel;
}
