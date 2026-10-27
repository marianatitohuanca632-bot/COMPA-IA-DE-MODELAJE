import subprocess
import time
import json
import urllib.request
import sys

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'C:\Users\WINDOWS 11\.gemini\antigravity-ide\brain\a0887dd2-84d2-4164-b8fd-a8f157131330\scratch\edge_profile'
proc = subprocess.Popen([
    edge_path,
    '--headless=new',
    '--remote-debugging-port=9224',
    f'--user-data-dir={user_data}',
    'http://localhost:5500/EJ00-TITO.html'
])

time.sleep(2.5)

try:
    tabs_data = urllib.request.urlopen('http://localhost:9224/json').read()
    tabs = json.loads(tabs_data)
    page_tabs = [t for t in tabs if t.get('type') == 'page' and 'EJ00-TITO' in t.get('url', '')]
    if not page_tabs:
        page_tabs = [t for t in tabs if t.get('type') == 'page']
    print("Found page tabs:", len(page_tabs))
    if page_tabs:
        tab = page_tabs[0]
        ws_url = tab.get('webSocketDebuggerUrl')
        print("Page tab title:", tab.get('title'))
        print("Page URL:", tab.get('url'))
        print("WebSocket URL:", ws_url)
        
        # Test using websockets if installed or simple socket
        import socket
        # Parse host and port from ws_url
        # ws://localhost:9224/devtools/page/...
        path = ws_url.split('localhost:9224')[1]
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(('localhost', 9224))
        # Simple HTTP Upgrade request for websocket
        key = "dGhlIHNhbXBsZSBub25jZQ=="
        req = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: localhost:9224\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(req.encode('utf-8'))
        resp = s.recv(1024).decode('utf-8', errors='ignore')
        print("WS Handshake response:", resp.splitlines()[0])

        def send_frame(msg):
            payload = msg.encode('utf-8')
            length = len(payload)
            frame = bytearray([0x81]) # text frame
            if length < 126:
                frame.append(0x80 | length)
            elif length < 65536:
                frame.append(0x80 | 126)
                frame.extend(length.to_bytes(2, 'big'))
            else:
                frame.append(0x80 | 127)
                frame.extend(length.to_bytes(8, 'big'))
            mask = b'\x01\x02\x03\x04'
            frame.extend(mask)
            masked = bytearray(payload[i] ^ mask[i % 4] for i in range(length))
            frame.extend(masked)
            s.sendall(frame)

        def recv_frame():
            hdr = s.recv(2)
            if not hdr: return None
            length = hdr[1] & 0x7f
            if length == 126:
                length = int.from_bytes(s.recv(2), 'big')
            elif length == 127:
                length = int.from_bytes(s.recv(8), 'big')
            data = bytearray()
            while len(data) < length:
                chunk = s.recv(length - len(data))
                if not chunk: break
                data.extend(chunk)
            return data.decode('utf-8', errors='ignore')

        # Enable Console and Runtime
        send_frame(json.dumps({"id": 1, "method": "Console.enable"}))
        send_frame(json.dumps({"id": 2, "method": "Runtime.enable"}))
        
        # Evaluate clicking buttons
        eval_script = """
        (() => {
            const results = {};
            const botones = document.querySelectorAll('#filtros button');
            botones.forEach(btn => {
                btn.click();
                const cont = document.querySelector('#lista-productos');
                results[btn.dataset.categoria] = {
                    cardsCount: cont.children.length,
                    activeBtnText: document.querySelector('#filtros button.activo').textContent.trim(),
                    statusText: document.querySelector('#resultado').textContent
                };
            });
            // Click on first card's inscribirme button
            const firstCardBtn = document.querySelector('.btn-inscribir');
            let selectVal = '';
            if (firstCardBtn) {
                firstCardBtn.click();
                selectVal = document.querySelector('#inscripcion').value;
            }
            results['inscribirClick'] = {
                selectVal,
                buttonText: firstCardBtn ? firstCardBtn.textContent.trim() : 'none'
            };
            return results;
        })()
        """
        send_frame(json.dumps({
            "id": 3,
            "method": "Runtime.evaluate",
            "params": { "expression": eval_script, "returnByValue": True }
        }))

        # Read frames for 2 seconds
        s.settimeout(2.0)
        logs = []
        errors = []
        try:
            while True:
                f = recv_frame()
                if not f: break
                msg = json.loads(f)
                if msg.get("method") == "Runtime.exceptionThrown":
                    errors.append(msg)
                elif msg.get("method") == "Console.messageAdded":
                    logs.append(msg)
                elif msg.get("id") == 3:
                    print("EVAL RESULT:", json.dumps(msg.get("result", {}).get("result", {}).get("value", {}), indent=2))
        except Exception as e:
            pass

        print("Console errors count:", len(errors))
        for err in errors:
            print("ERROR:", json.dumps(err, indent=2))
finally:
    proc.terminate()
