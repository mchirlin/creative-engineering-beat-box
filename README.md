# Beat Box

## Installation and Running

### Prerequisites
1. Nodejs

### To install
1. Clone this repo

### To run Websocket server:
1. Navigate to socket-io-server
2. Run `npm install` (just the first time to install dependencies)
3. Run `node app.js`;

### To run Client
1. Navigate to socket-io-client
2. Run `npm install` (just the first time to install dependencies)
3. Run `npm start`
4. Navigate to `http://<ip of server running client>:3031`

### To run arduino code
1. Update wifi ssid
2. Update wifi password
3. Update websocket server ip address

### Links
demo: https://youtu.be/MTehC_lPfV4
tinkercad box: https://www.tinkercad.com/things/3gwgQuOHOxM-music-box-enclosure
tonejs: https://tonejs.github.io/
tonejs instruments: https://github.com/nbrosowsky/tonejs-instruments

### Parts
I had most of these lying around, but below are equivalents

ESP8266 - 12E: https://www.amazon.com/KeeYees-Internet-Development-Wireless-Compatible/dp/B07HF44GBT/ref=sr_1_1?dchild=1&keywords=8266+12e&qid=1611602459&sr=8-1
Ultrasonic Sensor HC SR04 - https://www.amazon.com/Aokin-Ultrasonic-Distance-MEGA2560-ElecRight/dp/B07V6X647X/ref=sr_1_6?dchild=1&keywords=hc+sr04&qid=1611602712&s=electronics&sr=1-6
Potentiometer and knobs: https://www.amazon.com/Swpeet-Potentiometer-Assortment-Multiturn-HighPrecision/dp/B07ZKK6T8S/ref=sr_1_5?dchild=1&keywords=potentiometer+knob&qid=1611602580&sr=8-5
LEDs - https://www.amazon.com/ELEGOO-Diffused-Assorted-Colors-Arduino/dp/B0739RYXVC/ref=sr_1_1_sspa?dchild=1&keywords=elegoo+led+kit&qid=1611602529&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExSlNDTlM5SkwxVURXJmVuY3J5cHRlZElkPUEwNDE4MjA1MktEWkpLMkNHTkhZRiZlbmNyeXB0ZWRBZElkPUEwNTEwNDI0QzJLNDFPODNHMVkwJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==
Resistors - https://www.amazon.com/Elegoo-Values-Resistor-Assortment-Compliant/dp/B072BL2VX1/ref=sr_1_1_sspa?dchild=1&keywords=elegoo+resistor+kit&qid=1611602544&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExM0tMT1lRQkhWVU1CJmVuY3J5cHRlZElkPUEwNDU0ODk5MUFUOVlBMEUxTzdQRCZlbmNyeXB0ZWRBZElkPUEwNjY4Mzk3TkZYVUo4SFZURUZDJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==
Buttons - https://www.amazon.com/Yowming-6colors12MM-Waterproof-Momentary-Button/dp/B07NQ9KPX6/ref=sxts_sxwds-bia-wc-nc-drs1_0?cv_ct_cx=button+momentary&dchild=1&keywords=button+momentary&pd_rd_i=B07NQ9KPX6&pd_rd_r=0bd04cf0-8ada-4017-91e4-6383d9677b7a&pd_rd_w=RoDjb&pd_rd_wg=BL8m3&pf_rd_p=a64002b9-9c26-4361-b8a1-b0f5a4835670&pf_rd_r=5AK4VPHF0NFNMGFSZ8N6&psc=1&qid=1611602644&sr=1-1-38d0a374-3318-4625-ad92-b6761a63ecf6
