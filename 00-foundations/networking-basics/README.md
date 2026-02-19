# Networking Basics

## What is it?

Networking is how computers communicate with each other by sending and receiving data over physical or wireless connections. Just like how you might send a letter through the postal service, computers send packets of information through networks using agreed-upon rules called protocols.

At its core, a computer network is simply two or more computers connected in a way that lets them share resources and information. This could be as simple as two laptops connected by a cable, or as complex as the entire internet connecting billions of devices worldwide.

The fundamental purpose of networking is to enable communication, resource sharing, and collaboration between computing devices, regardless of their physical location.

## Simple Analogy

Think of computer networking like a postal system:

- **Your home address** = IP address (identifies where you are)
- **The postal service** = Network infrastructure (routers, switches, cables)
- **Envelopes with letters** = Data packets (information being sent)
- **Postal rules** = Protocols (TCP/IP, HTTP, etc.)
- **Post offices** = Routers (decide where to send mail next)
- **Mail carrier** = Network interface (delivers to your door)
- **Zip codes** = Network segments (group addresses by region)

When you send a letter, you write a message, put it in an envelope with an address, drop it in a mailbox, and the postal service figures out how to get it to the destination. Computer networking works the same way—your computer packages data, adds an address, and sends it through the network infrastructure which figures out the best route to deliver it.

## Why Does It Matter?

Networking is the foundation of modern computing and business:

**Business Impact:**
- **Global communication**: Teams collaborate across continents in real-time
- **Cloud computing**: Access powerful servers and storage from anywhere
- **E-commerce**: Businesses reach customers worldwide 24/7
- **Remote work**: Employees work from home as effectively as from offices
- **Data sharing**: Systems exchange information instantly

**Technical Impact:**
- **Distributed systems**: Applications run across multiple servers
- **Scalability**: Add more servers to handle increased traffic
- **Redundancy**: If one server fails, others can take over
- **Specialization**: Different servers handle different tasks efficiently
- **Integration**: Different systems and services work together seamlessly

Without networking, every computer would be isolated. We wouldn't have the internet, cloud services, email, video calls, or most modern software applications. Understanding networking is essential for building any software that communicates with other systems—which is virtually all modern software.

## How It Works

### The Network Stack

Computer networking is organized in layers, each handling a specific aspect of communication. This is called the OSI (Open Systems Interconnection) model:

```
┌─────────────────────────────────────────────┐
│  Application Layer (Layer 7)               │  ← What you interact with
│  (HTTP, FTP, SMTP, DNS)                    │     (Web browsers, email)
├─────────────────────────────────────────────┤
│  Presentation Layer (Layer 6)              │  ← Data formatting
│  (Encryption, compression, encoding)       │     (SSL/TLS, JPEG, ASCII)
├─────────────────────────────────────────────┤
│  Session Layer (Layer 5)                   │  ← Managing connections
│  (Session establishment, maintenance)      │     (Start/stop/resume)
├─────────────────────────────────────────────┤
│  Transport Layer (Layer 4)                 │  ← Reliable delivery
│  (TCP, UDP)                                │     (Error checking, ordering)
├─────────────────────────────────────────────┤
│  Network Layer (Layer 3)                   │  ← Routing between networks
│  (IP, routing)                             │     (IP addresses, routing)
├─────────────────────────────────────────────┤
│  Data Link Layer (Layer 2)                 │  ← Node-to-node transfer
│  (Ethernet, Wi-Fi, MAC addresses)          │     (Switches, MAC addresses)
├─────────────────────────────────────────────┤
│  Physical Layer (Layer 1)                  │  ← Physical transmission
│  (Cables, radio waves, electrical signals) │     (Wires, light, radio)
└─────────────────────────────────────────────┘
```

In practice, most developers work with a simplified 4-layer model (TCP/IP model):

```
┌─────────────────────────────────────────┐
│  Application Layer                      │  ← HTTP, DNS, FTP, SMTP
│  (What users interact with)             │
├─────────────────────────────────────────┤
│  Transport Layer                        │  ← TCP, UDP
│  (How data is sent reliably)            │
├─────────────────────────────────────────┤
│  Internet Layer                         │  ← IP (routing between networks)
│  (How packets find their destination)   │
├─────────────────────────────────────────┤
│  Network Access Layer                   │  ← Ethernet, Wi-Fi
│  (Physical transmission)                │
└─────────────────────────────────────────┘
```

### Step-by-Step: How Data Travels

When you request a webpage (example: visiting www.example.com):

**Step 1: Application Layer - You make a request**
```
User types: www.example.com
Browser creates HTTP request: "GET /index.html HTTP/1.1"
```

**Step 2: DNS Resolution - Finding the address**
```
Browser asks: "What's the IP address for www.example.com?"
DNS server responds: "It's 93.184.216.34"
```

**Step 3: Transport Layer - Breaking into packets**
```
TCP breaks the request into small packets
Each packet gets:
  - Source port (e.g., 54321)
  - Destination port (80 for HTTP or 443 for HTTPS)
  - Sequence number (so they can be reassembled)
  - Checksum (to detect errors)
```

**Step 4: Internet Layer - Adding addresses**
```
IP layer adds:
  - Source IP address (your computer: 192.168.1.100)
  - Destination IP address (example.com: 93.184.216.34)
```

**Step 5: Network Access Layer - Physical transmission**
```
Data is converted to electrical signals, light pulses, or radio waves
Sent through cables or wireless connections
```

**Step 6: Routing - Finding the path**
```
Your packet travels through multiple routers:

Your Computer (192.168.1.100)
    ↓
Home Router (192.168.1.1)
    ↓
ISP Router (10.50.1.1)
    ↓
Internet Backbone Routers
    ↓
Destination ISP Router
    ↓
Destination Server (93.184.216.34)
```

**Step 7: Receiving and responding**
```
Server receives all packets
Reassembles them in order using sequence numbers
Processes the request
Sends response back through the same process
```

### Detailed Component Breakdown

#### IP Addresses

IP addresses are unique identifiers for devices on a network.

**IPv4 (32-bit):**
```
Format: 192.168.1.100
Parts: 4 numbers (0-255) separated by dots
Total possible: ~4.3 billion addresses

Structure:
┌──────────────┬──────────────┐
│ Network Part │  Host Part   │
└──────────────┴──────────────┘
  192.168.1     .    100

Classes:
Class A: 1.0.0.0 to 126.255.255.255   (Large networks)
Class B: 128.0.0.0 to 191.255.255.255 (Medium networks)
Class C: 192.0.0.0 to 223.255.255.255 (Small networks)

Special ranges:
10.0.0.0 - 10.255.255.255     (Private - large orgs)
172.16.0.0 - 172.31.255.255   (Private - medium orgs)
192.168.0.0 - 192.168.255.255 (Private - home networks)
127.0.0.1                     (Localhost - your own computer)
```

**IPv6 (128-bit):**
```
Format: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Parts: 8 groups of 4 hexadecimal digits
Total possible: 340 undecillion addresses (basically unlimited)

Why we need it:
IPv4 ran out of addresses, IPv6 provides enough for every device
```

#### Subnets and Subnet Masks

Subnets divide large networks into smaller, manageable segments.

```
IP Address:    192.168.1.100
Subnet Mask:   255.255.255.0

Breaking it down:
255.255.255.0 = 11111111.11111111.11111111.00000000 (binary)
                └─────── Network ─────────┘ └─ Host ─┘

This means:
- 192.168.1 is the network identifier
- 0-255 are available for host devices
- Actual usable: 1-254 (0 is network, 255 is broadcast)

CIDR Notation: 192.168.1.0/24
/24 = 24 bits for network, 8 bits for hosts
```

**Common subnet masks:**
```
/8  = 255.0.0.0       = 16,777,214 hosts
/16 = 255.255.0.0     = 65,534 hosts
/24 = 255.255.255.0   = 254 hosts
/30 = 255.255.255.252 = 2 hosts (point-to-point links)
```

#### Ports

Ports allow multiple applications to use the network simultaneously on one computer.

```
Think of IP address as a street address,
and port as an apartment number:

IP Address     Port    Service
────────────────────────────────────────────
93.184.216.34  :80  ← Web server (HTTP)
93.184.216.34  :443 ← Secure web (HTTPS)
93.184.216.34  :22  ← SSH (remote login)
93.184.216.34  :3306 ← MySQL database

Port ranges:
0-1023:     Well-known ports (system services)
1024-49151: Registered ports (applications)
49152-65535: Dynamic/private ports (temporary)
```

**Common ports:**
```
20/21  - FTP (File Transfer)
22     - SSH (Secure Shell)
23     - Telnet (insecure remote access)
25     - SMTP (Email sending)
53     - DNS (Domain Name System)
80     - HTTP (Web traffic)
110    - POP3 (Email retrieval)
143    - IMAP (Email access)
443    - HTTPS (Secure web traffic)
3306   - MySQL database
5432   - PostgreSQL database
6379   - Redis cache
8080   - Alternative HTTP (development)
27017  - MongoDB database
```

#### TCP vs UDP

Two main ways to send data, each with different trade-offs:

**TCP (Transmission Control Protocol):**
```
Characteristics:
✓ Connection-oriented (handshake required)
✓ Reliable delivery (guaranteed arrival)
✓ Ordered delivery (packets arrive in sequence)
✓ Error checking and correction
✓ Flow control (sender won't overwhelm receiver)
✗ Slower (due to overhead)
✗ More bandwidth (acknowledgments and retransmissions)

TCP Three-Way Handshake:
Client → Server: SYN (synchronize)
Server → Client: SYN-ACK (synchronize-acknowledge)
Client → Server: ACK (acknowledge)
Now connected! Data can flow.

Use cases:
- Web browsing (HTTP/HTTPS)
- Email (SMTP, IMAP)
- File transfers (FTP, SFTP)
- Remote access (SSH)
- Anything where data accuracy matters
```

**UDP (User Datagram Protocol):**
```
Characteristics:
✓ Connectionless (no handshake)
✓ Fast (minimal overhead)
✓ Low latency
✗ Unreliable (packets may be lost)
✗ No ordering guarantee
✗ No error correction

Sending data:
Just send! No handshake, no waiting for acknowledgment

Use cases:
- Video streaming (some lost frames OK)
- Online gaming (speed matters, slight data loss tolerable)
- Voice calls (VoIP)
- DNS queries (small, can retry if needed)
- Live broadcasts
```

**Comparison:**
```
Scenario: Sending 1 MB of data

TCP:
[SYN] [SYN-ACK] [ACK] [Data] [ACK] [Data] [ACK] [Data] [ACK]...
Time: ~500ms, Delivery: 100%

UDP:
[Data] [Data] [Data] [Data]...
Time: ~50ms, Delivery: 98% (some packets lost)

TCP is like certified mail: slow but guaranteed
UDP is like shouting across a room: fast but might miss words
```

#### Routing

Routing is how packets find their way across networks.

**Routing Table Example:**
```
Destination      Gateway         Interface    Metric
───────────────────────────────────────────────────
0.0.0.0          192.168.1.1     eth0        100  ← Default route
192.168.1.0/24   0.0.0.0         eth0        0    ← Local network
10.0.0.0/8       10.0.0.1        eth1        50   ← Private network

Reading this:
- Traffic to 192.168.1.x: send directly (same network)
- Traffic to 10.0.0.x: send to 10.0.0.1 via eth1
- Everything else: send to 192.168.1.1 (default gateway)
```

**How routers decide:**
```
1. Look at destination IP
2. Check routing table for best match
3. Forward packet to next hop
4. Repeat until packet reaches destination

Metrics determine preference:
Lower number = preferred route

Example path:
Your Computer
  ↓ (2 hops)
ISP Router A
  ↓ (5 hops)
Internet Backbone
  ↓ (3 hops)
Destination ISP
  ↓ (1 hop)
Destination Server

Total: 11 hops
```

#### NAT (Network Address Translation)

NAT allows multiple devices to share one public IP address.

```
Inside your home network:
Device            Private IP
─────────────────────────────
Laptop           192.168.1.100
Phone            192.168.1.101
Smart TV         192.168.1.102
Tablet           192.168.1.103

Router's public IP (facing internet): 203.0.113.45

When laptop requests www.example.com:
┌─────────────────────────────────────┐
│ Inside Network                      │
│                                     │
│ Laptop: 192.168.1.100:54321         │
│         ↓                           │
│ Router performs NAT:                │
│   - Changes source to 203.0.113.45  │
│   - Tracks which internal device    │
│         ↓                           │
└─────────────────────────────────────┘
         ↓
    Internet
         ↓
┌─────────────────────────────────────┐
│ Server sees:                        │
│ Source: 203.0.113.45:54321          │
│                                     │
│ Response goes back to:              │
│ 203.0.113.45:54321                  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Router receives response:           │
│   - Looks up port 54321             │
│   - Finds it belongs to laptop      │
│   - Forwards to 192.168.1.100       │
└─────────────────────────────────────┘

Benefits:
✓ Conserves public IP addresses
✓ Provides basic security (hides internal IPs)
✓ Allows many devices to share one connection

Types:
- Static NAT: One-to-one mapping
- Dynamic NAT: Pool of public IPs
- PAT (Port Address Translation): One public IP, many devices
```

#### DNS (Domain Name System)

DNS translates human-readable domain names to IP addresses.

```
You type: www.example.com
Computer needs: 93.184.216.34

DNS Resolution Process:

Step 1: Check local cache
Computer: "Do I already know example.com?"
Cache: "No" → Continue

Step 2: Ask recursive resolver (usually your ISP)
Your Computer → ISP DNS: "What's example.com?"
ISP checks its cache → Not found → Continue

Step 3: Ask root nameserver
ISP → Root Server: "What's example.com?"
Root: "I don't know, but .com servers know, try 192.5.5.241"

Step 4: Ask TLD (Top Level Domain) server
ISP → .com Server: "What's example.com?"
.com: "Ask example.com's nameserver at 93.184.216.34"

Step 5: Ask authoritative nameserver
ISP → example.com NS: "What's www.example.com?"
NS: "www.example.com is 93.184.216.34"

Step 6: Return to user
ISP → Your Computer: "www.example.com is 93.184.216.34"
Computer caches this for future use
```

**DNS Record Types:**
```
A Record:     Maps domain to IPv4 address
              example.com → 93.184.216.34

AAAA Record:  Maps domain to IPv6 address
              example.com → 2606:2800:220:1:248:1893:25c8:1946

CNAME:        Alias (points to another domain)
              www.example.com → example.com

MX Record:    Mail server
              example.com → mail.example.com

TXT Record:   Text information (often for verification)
              example.com → "v=spf1 include:_spf.google.com ~all"

NS Record:    Nameservers for domain
              example.com → ns1.example.com

PTR Record:   Reverse DNS (IP to domain)
              93.184.216.34 → example.com
```

#### DHCP (Dynamic Host Configuration Protocol)

DHCP automatically assigns IP addresses to devices on a network.

```
Device connects to network:

Step 1: DHCP Discover (broadcast)
New Device → All: "I need an IP address! Anyone have one?"

Step 2: DHCP Offer
DHCP Server → New Device: "I can give you 192.168.1.150"

Step 3: DHCP Request
New Device → Server: "I accept 192.168.1.150"

Step 4: DHCP Acknowledgment
DHCP Server → New Device: "Confirmed! Here's your config:
  - IP Address: 192.168.1.150
  - Subnet Mask: 255.255.255.0
  - Default Gateway: 192.168.1.1
  - DNS Servers: 8.8.8.8, 8.8.4.4
  - Lease Time: 24 hours"

After 24 hours, device must renew the lease or get a new IP.

Why DHCP matters:
✓ No manual IP configuration
✓ Prevents IP conflicts
✓ Easy to manage large networks
✓ Devices can roam between networks
```

#### Network Devices

**Router:**
```
Purpose: Connects different networks, routes packets

Function:
- Reads destination IP address
- Consults routing table
- Forwards packet to appropriate interface
- Can connect LAN to WAN (internet)

Example:
Internet ← Router → Home Network
            ↓
    Routing decisions made here
```

**Switch:**
```
Purpose: Connects devices within a network

Function:
- Reads MAC addresses
- Forwards frames to specific ports
- Learns which devices are on which ports
- More efficient than hubs (targeted delivery)

Example:
Switch
├── Port 1: Computer A (MAC: AA:BB:CC:DD:EE:01)
├── Port 2: Computer B (MAC: AA:BB:CC:DD:EE:02)
├── Port 3: Printer   (MAC: AA:BB:CC:DD:EE:03)
└── Port 4: Server    (MAC: AA:BB:CC:DD:EE:04)

When A sends to B:
Switch sees destination MAC (BB), sends only to Port 2
```

**Hub:**
```
Purpose: Connects devices (outdated)

Function:
- Receives signal on one port
- Broadcasts to ALL other ports
- No intelligence, no filtering

Why obsolete:
✗ Wastes bandwidth
✗ All devices share collision domain
✗ No security (everyone sees everything)

Replaced by switches
```

**Firewall:**
```
Purpose: Security barrier, filters traffic

Function:
- Inspects incoming and outgoing packets
- Allows or blocks based on rules
- Can operate at various layers

Rules example:
Allow:   Port 443 (HTTPS) from anywhere
Allow:   Port 22 (SSH) from 203.0.113.0/24 only
Block:   Port 23 (Telnet) from everywhere
Block:   All traffic from 192.0.2.0/24

Types:
- Packet filtering: Based on IP, port, protocol
- Stateful: Tracks connection state
- Application layer: Deep packet inspection
```

**Load Balancer:**
```
Purpose: Distributes traffic across multiple servers

Function:
- Receives requests
- Selects backend server using algorithm
- Forwards request to chosen server
- Monitors server health

Algorithms:
Round Robin:    Cycle through servers sequentially
Least Connections: Send to server with fewest active connections
IP Hash:        Same client always goes to same server
Weighted:       More powerful servers get more traffic

Example:
           Internet
              ↓
        Load Balancer
       ┌──────┼──────┐
       ↓      ↓      ↓
    Server1 Server2 Server3
    (33%)   (33%)   (33%)
```

## Key Concepts

### Network Topologies

The physical or logical arrangement of network devices.

**Star Topology:**
```
        [Switch]
    ┌─────┼─────┐
    ↓     ↓     ↓
   [A]   [B]   [C]

Pros: Easy to add devices, failure of one doesn't affect others
Cons: Switch failure breaks entire network
Common: Most modern networks
```

**Bus Topology:**
```
[A]───[B]───[C]───[D]
         (Single backbone cable)

Pros: Simple, uses less cable
Cons: Entire network fails if backbone breaks, collisions
Common: Older Ethernet networks (obsolete)
```

**Ring Topology:**
```
    [A]
   ↗   ↘
[D]     [B]
   ↖   ↙
    [C]

Pros: Equal access for all devices
Cons: One device failure can break entire network
Common: Some industrial networks (rare today)
```

**Mesh Topology:**
```
    [A]────[B]
    │ ╲  ╱ │
    │  ╳   │
    │ ╱  ╲ │
    [C]────[D]

Pros: Highly redundant, fault-tolerant
Cons: Expensive, complex
Common: Internet backbone, critical infrastructure
```

**Hybrid Topology:**
```
Combination of topologies
Common: Star-bus (office buildings), Star-ring (metro networks)
```

### Bandwidth and Throughput

**Bandwidth:**
```
Definition: Maximum data transfer capacity
Like: Width of a highway (how many lanes)

Measured in: bits per second (bps)
- Kbps: Kilobits per second (thousands)
- Mbps: Megabits per second (millions)
- Gbps: Gigabits per second (billions)
- Tbps: Terabits per second (trillions)

Common speeds:
DSL:        1-100 Mbps
Cable:      100-1000 Mbps
Fiber:      1-10 Gbps
Mobile 4G:  5-100 Mbps
Mobile 5G:  100-1000 Mbps
```

**Throughput:**
```
Definition: Actual data transfer rate achieved
Like: How many cars actually drive on the highway

Why different from bandwidth:
- Network congestion
- Protocol overhead
- Error correction
- Hardware limitations

Example:
Bandwidth:  100 Mbps
Throughput: 85 Mbps (typical real-world)
```

**Latency:**
```
Definition: Time for data to travel from source to destination
Measured in: Milliseconds (ms)

Components:
- Propagation delay: Physical distance
- Transmission delay: Time to put data on wire
- Processing delay: Router/switch processing
- Queuing delay: Waiting in buffers

Examples:
Local network:  < 1 ms
Same city:      5-20 ms
Across country: 50-100 ms
Intercontinental: 150-300 ms
Satellite:      500-700 ms

Why it matters:
Low latency: Real-time gaming, video calls, trading systems
High latency OK: Email, file downloads, backups
```

### Packet Structure

Data sent over networks is broken into packets. Here's what a packet looks like:

**TCP/IP Packet:**
```
┌───────────────────────────────────────────┐
│ Ethernet Header (14 bytes)                │
│ ┌─────────────────────────────────────┐   │
│ │ Dest MAC | Src MAC | Type            │   │
│ └─────────────────────────────────────┘   │
├───────────────────────────────────────────┤
│ IP Header (20+ bytes)                     │
│ ┌─────────────────────────────────────┐   │
│ │ Version | Length | TTL | Protocol    │   │
│ │ Source IP | Destination IP          │   │
│ └─────────────────────────────────────┘   │
├───────────────────────────────────────────┤
│ TCP Header (20+ bytes)                    │
│ ┌─────────────────────────────────────┐   │
│ │ Src Port | Dest Port                │   │
│ │ Sequence # | Acknowledgment #       │   │
│ │ Flags | Window Size | Checksum      │   │
│ └─────────────────────────────────────┘   │
├───────────────────────────────────────────┤
│ Data (Payload)                            │
│ ┌─────────────────────────────────────┐   │
│ │ Your actual data here               │   │
│ │ (up to ~1460 bytes for Ethernet)    │   │
│ └─────────────────────────────────────┘   │
└───────────────────────────────────────────┘

Total typical packet: ~1500 bytes (MTU)
- Headers: ~54 bytes
- Data: ~1446 bytes
```

**Important header fields:**
```
TTL (Time To Live):
  - Starts at a number (e.g., 64)
  - Decrements at each router
  - Packet discarded when TTL reaches 0
  - Prevents infinite routing loops

Sequence Number:
  - Orders packets for reassembly
  - Detects missing packets

Acknowledgment Number:
  - Confirms receipt
  - Triggers retransmission if missing

Checksum:
  - Detects corruption
  - Packet discarded if checksum fails
```

### Network Security Basics

**Firewalls:**
```
Types:
1. Packet Filtering
   - Examines: Source/dest IP, ports, protocol
   - Fast but limited

2. Stateful Inspection
   - Tracks connection state
   - Allows return traffic for established connections

3. Application Layer
   - Deep packet inspection
   - Understands protocols (HTTP, FTP)
   - Can block specific content

4. Next-Generation
   - Includes IDS/IPS
   - SSL inspection
   - User identity-based rules
```

**VPN (Virtual Private Network):**
```
Purpose: Secure communication over public networks

How it works:
Your Computer → Encrypted Tunnel → VPN Server → Internet

Steps:
1. Establish connection to VPN server
2. Create encrypted tunnel
3. All traffic routed through tunnel
4. VPN server sends traffic to destination
5. Responses come back through tunnel

Benefits:
✓ Encryption (privacy)
✓ Hides your IP address
✓ Access to remote networks
✓ Bypass geo-restrictions

Types:
- Site-to-Site: Connects offices
- Remote Access: Employees work from home
- SSL VPN: Browser-based
- IPsec VPN: Network-level encryption
```

**Common Attacks:**
```
1. DDoS (Distributed Denial of Service)
   - Overwhelm server with traffic
   - Makes service unavailable
   - Mitigation: Rate limiting, CDN, filtering

2. Man-in-the-Middle (MITM)
   - Intercept communication between two parties
   - Can read/modify traffic
   - Prevention: Encryption (HTTPS, VPN)

3. Packet Sniffing
   - Capture packets on network
   - Read unencrypted data
   - Prevention: Encryption

4. Port Scanning
   - Probe for open ports
   - Identify vulnerabilities
   - Prevention: Firewall, close unused ports

5. ARP Spoofing
   - Redirect traffic by faking MAC addresses
   - Prevention: Static ARP entries, monitoring
```

### Quality of Service (QoS)

QoS prioritizes certain types of traffic over others.

```
Why needed:
Network has limited bandwidth → Can't send everything at once
Some traffic is time-sensitive (video calls)
Some traffic is not (file downloads)

Priority levels:
┌─────────────────────────────────┐
│ High Priority (send first)      │
│ - VoIP (phone calls)            │
│ - Video conferencing            │
│ - Interactive gaming            │
├─────────────────────────────────┤
│ Medium Priority                 │
│ - Web browsing                  │
│ - Email                         │
│ - Business applications         │
├─────────────────────────────────┤
│ Low Priority (send when idle)   │
│ - File downloads                │
│ - Backups                       │
│ - Software updates              │
└─────────────────────────────────┘

Techniques:
1. Traffic Shaping: Control rate of traffic
2. Traffic Policing: Drop excess traffic
3. Packet Marking: Tag packets with priority
4. Queuing: Different queues for different priorities
```

### Network Monitoring

**Key metrics to monitor:**
```
1. Bandwidth Utilization
   - % of capacity used
   - Alert when > 80%

2. Latency
   - Round-trip time
   - Alert on spikes

3. Packet Loss
   - % of packets dropped
   - Should be < 0.1%

4. Errors
   - CRC errors
   - Collisions
   - Retransmissions

5. Availability
   - Uptime percentage
   - SLA typically 99.9% or higher
```

**Tools:**
```
ping:
  - Tests connectivity
  - Measures latency
  - Example: ping google.com

traceroute (tracert on Windows):
  - Shows path packets take
  - Identifies where delays occur
  - Example: traceroute google.com

netstat:
  - Shows active connections
  - Displays listening ports
  - Example: netstat -an

nslookup / dig:
  - DNS queries
  - Troubleshoot DNS issues
  - Example: nslookup example.com

wireshark:
  - Packet capture and analysis
  - See actual network traffic
  - Deep inspection of packets

iperf:
  - Bandwidth testing
  - Measures throughput between two hosts
```

## Best Practices

### Safety

**Network Segmentation:**
```python
# Separate networks for different purposes
# Example: AWS VPC configuration

import boto3

def create_segmented_network():
    """
    Create segmented network with separate subnets for different tiers.

    Why this matters:
    - Limits blast radius of security breaches
    - Applies appropriate security controls per tier
    - Meets compliance requirements for data isolation

    Best Practices:
    - Public subnet: Only load balancers and bastion hosts
    - Private subnet: Application servers (no direct internet)
    - Data subnet: Databases (most restricted)
    - Management subnet: Admin access only
    """
    ec2 = boto3.client('ec2')

    # Create VPC
    vpc = ec2.create_vpc(CidrBlock='10.0.0.0/16')
    vpc_id = vpc['Vpc']['VpcId']

    # Public subnet (internet-facing resources)
    public_subnet = ec2.create_subnet(
        VpcId=vpc_id,
        CidrBlock='10.0.1.0/24',
        AvailabilityZone='us-east-1a'
    )

    # Private subnet (application tier)
    private_subnet = ec2.create_subnet(
        VpcId=vpc_id,
        CidrBlock='10.0.2.0/24',
        AvailabilityZone='us-east-1a'
    )

    # Data subnet (database tier)
    data_subnet = ec2.create_subnet(
        VpcId=vpc_id,
        CidrBlock='10.0.3.0/24',
        AvailabilityZone='us-east-1a'
    )

    # Log the configuration
    logger.info(f"Created segmented VPC: {vpc_id}")
    logger.info(f"Public subnet: {public_subnet['Subnet']['SubnetId']}")
    logger.info(f"Private subnet: {private_subnet['Subnet']['SubnetId']}")
    logger.info(f"Data subnet: {data_subnet['Subnet']['SubnetId']}")

    return vpc_id
```

**Firewall Rules:**
```python
# Implement least-privilege firewall rules
# Example: Security group configuration

def create_secure_firewall_rules():
    """
    Create security group with minimal required access.

    Why this matters:
    - Reduces attack surface
    - Follows principle of least privilege
    - Prevents unauthorized access

    Best Practices:
    - Default deny all traffic
    - Explicitly allow only necessary ports
    - Restrict source IPs where possible
    - Document each rule's purpose
    - Review rules quarterly
    """
    ec2 = boto3.client('ec2')

    # Create security group
    sg = ec2.create_security_group(
        GroupName='web-server-sg',
        Description='Security group for web servers',
        VpcId='vpc-12345678'
    )
    sg_id = sg['GroupId']

    # Allow HTTPS from anywhere (public web service)
    ec2.authorize_security_group_ingress(
        GroupId=sg_id,
        IpPermissions=[
            {
                'IpProtocol': 'tcp',
                'FromPort': 443,
                'ToPort': 443,
                'IpRanges': [{'CidrIp': '0.0.0.0/0', 'Description': 'HTTPS from internet'}]
            }
        ]
    )

    # Allow HTTP from anywhere (redirect to HTTPS)
    ec2.authorize_security_group_ingress(
        GroupId=sg_id,
        IpPermissions=[
            {
                'IpProtocol': 'tcp',
                'FromPort': 80,
                'ToPort': 80,
                'IpRanges': [{'CidrIp': '0.0.0.0/0', 'Description': 'HTTP redirect'}]
            }
        ]
    )

    # Allow SSH only from company IP range
    ec2.authorize_security_group_ingress(
        GroupId=sg_id,
        IpPermissions=[
            {
                'IpProtocol': 'tcp',
                'FromPort': 22,
                'ToPort': 22,
                'IpRanges': [{'CidrIp': '203.0.113.0/24', 'Description': 'SSH from office'}]
            }
        ]
    )

    # Log configuration
    logger.info(f"Created security group: {sg_id}")
    logger.info("Rules: HTTPS (0.0.0.0/0), HTTP (0.0.0.0/0), SSH (203.0.113.0/24)")

    return sg_id
```

**Encryption in Transit:**
```python
# Always encrypt data traveling over networks
# Example: Forcing HTTPS

from flask import Flask, request, redirect

app = Flask(__name__)

@app.before_request
def enforce_https():
    """
    Redirect all HTTP traffic to HTTPS.

    Why this matters:
    - Prevents man-in-the-middle attacks
    - Protects user data and credentials
    - Required for compliance (PCI-DSS, HIPAA)
    - Improves SEO ranking

    Best Practices:
    - Use HTTPS everywhere, not just for sensitive pages
    - Use TLS 1.2 or higher
    - Configure strong cipher suites
    - Enable HSTS (HTTP Strict Transport Security)
    - Monitor certificate expiration
    """
    if not request.is_secure and not app.debug:
        # Redirect to HTTPS
        url = request.url.replace('http://', 'https://', 1)
        logger.warning(f"Redirecting HTTP to HTTPS: {request.url} -> {url}")
        return redirect(url, code=301)

# Example: Making HTTPS requests with certificate verification
import requests

def fetch_data_securely(url):
    """
    Fetch data with proper certificate verification.

    Best Practices:
    - Always verify SSL certificates
    - Use certificate pinning for critical connections
    - Handle SSL errors appropriately (don't ignore)
    - Keep CA bundle updated
    """
    try:
        # verify=True ensures certificate is valid
        response = requests.get(url, verify=True, timeout=10)
        response.raise_for_status()

        logger.info(f"Successfully fetched from {url}")
        return response.json()

    except requests.exceptions.SSLError as e:
        logger.error(f"SSL certificate verification failed for {url}: {e}")
        # Do NOT ignore this error
        raise
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for {url}: {e}")
        raise
```

### Quality

**Connection Pooling:**
```python
# Reuse connections for better performance and reliability
# Example: Database connection pooling

import psycopg2
from psycopg2 import pool
import logging

logger = logging.getLogger(__name__)

class DatabaseConnection:
    """
    Manages database connections with pooling.

    Why this matters:
    - Creating connections is expensive (TCP handshake, authentication)
    - Pools reuse existing connections
    - Prevents connection exhaustion
    - Improves performance

    Best Practices:
    - Size pool based on expected concurrent requests
    - Set connection timeouts
    - Monitor pool usage
    - Handle connection errors gracefully
    - Return connections to pool in finally block
    """

    def __init__(self):
        try:
            # Create connection pool
            self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                minconn=5,          # Minimum connections maintained
                maxconn=20,         # Maximum connections allowed
                host='db.example.com',
                database='myapp',
                user='app_user',
                password='secure_password',
                connect_timeout=10   # Connection timeout in seconds
            )

            logger.info("Database connection pool created (min=5, max=20)")

        except psycopg2.Error as e:
            logger.error(f"Failed to create connection pool: {e}")
            raise

    def execute_query(self, query, params=None):
        """
        Execute query using pooled connection.

        Best Practices:
        - Always use parameterized queries (prevent SQL injection)
        - Return connection to pool in finally block
        - Log query errors with context
        - Set statement timeout
        """
        conn = None
        try:
            # Get connection from pool
            conn = self.connection_pool.getconn()

            if conn is None:
                raise Exception("No connections available in pool")

            with conn.cursor() as cursor:
                # Set statement timeout (prevent long-running queries)
                cursor.execute("SET statement_timeout = 30000")  # 30 seconds

                # Execute query with parameters (safe from SQL injection)
                cursor.execute(query, params)
                result = cursor.fetchall()

                conn.commit()

                logger.info(f"Query executed successfully, returned {len(result)} rows")
                return result

        except psycopg2.Error as e:
            if conn:
                conn.rollback()
            logger.error(f"Query execution failed: {e}")
            logger.error(f"Query: {query}, Params: {params}")
            raise

        finally:
            # Always return connection to pool
            if conn:
                self.connection_pool.putconn(conn)
```

**Retry Logic with Exponential Backoff:**
```python
# Handle transient network failures gracefully
# Example: HTTP requests with retries

import requests
import time
import logging
from typing import Optional

logger = logging.getLogger(__name__)

def make_request_with_retry(url: str, max_retries: int = 3) -> Optional[dict]:
    """
    Make HTTP request with exponential backoff retry.

    Why this matters:
    - Networks are unreliable (packet loss, timeouts)
    - Temporary failures are common (server overload, network congestion)
    - Retrying resolves most transient issues
    - Exponential backoff prevents overwhelming failing service

    Best Practices:
    - Limit number of retries (prevent infinite loops)
    - Use exponential backoff (wait longer between retries)
    - Add jitter (randomization prevents thundering herd)
    - Log all retry attempts
    - Only retry on transient errors (not 4xx errors)
    - Set total timeout across all retries
    """

    # Errors that should trigger retry
    retryable_errors = (
        requests.exceptions.ConnectionError,
        requests.exceptions.Timeout,
        requests.exceptions.HTTPError  # Only for 5xx errors
    )

    for attempt in range(max_retries + 1):
        try:
            # Make request with timeout
            response = requests.get(url, timeout=10)

            # Check if status code indicates retry-able error
            if response.status_code >= 500:
                raise requests.exceptions.HTTPError(
                    f"Server error: {response.status_code}"
                )

            # 4xx errors should not be retried (client error)
            response.raise_for_status()

            logger.info(f"Request to {url} succeeded on attempt {attempt + 1}")
            return response.json()

        except retryable_errors as e:
            # Last attempt - raise error
            if attempt == max_retries:
                logger.error(f"Request to {url} failed after {max_retries + 1} attempts")
                raise

            # Calculate backoff time: 2^attempt seconds
            # Attempt 0: 1 second, Attempt 1: 2 seconds, Attempt 2: 4 seconds
            backoff_time = 2 ** attempt

            # Add jitter (randomization between 0 and 1 second)
            import random
            jitter = random.uniform(0, 1)
            wait_time = backoff_time + jitter

            logger.warning(
                f"Request to {url} failed (attempt {attempt + 1}/{max_retries + 1}): {e}"
            )
            logger.info(f"Retrying in {wait_time:.2f} seconds...")

            time.sleep(wait_time)

        except requests.exceptions.RequestException as e:
            # Non-retryable error (e.g., invalid URL, 4xx error)
            logger.error(f"Non-retryable error for {url}: {e}")
            raise
```

**Circuit Breaker Pattern:**
```python
# Prevent cascading failures in distributed systems
# Example: Circuit breaker for external API calls

import time
import logging
from enum import Enum
from typing import Callable, Any

logger = logging.getLogger(__name__)

class CircuitState(Enum):
    CLOSED = "closed"     # Normal operation
    OPEN = "open"         # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing if service recovered

class CircuitBreaker:
    """
    Implements circuit breaker pattern for network calls.

    Why this matters:
    - Prevents wasting resources on failing service
    - Allows failing service time to recover
    - Provides fast failure (don't wait for timeout)
    - Prevents cascading failures in microservices

    States:
    - CLOSED: Normal operation, requests go through
    - OPEN: Service failing, reject requests immediately
    - HALF_OPEN: Testing if service recovered

    Best Practices:
    - Monitor circuit state (alert when open)
    - Set appropriate thresholds for your service
    - Log state transitions
    - Provide fallback when circuit is open
    - Reset after service recovers
    """

    def __init__(
        self,
        failure_threshold: int = 5,    # Failures before opening circuit
        recovery_timeout: int = 60,     # Seconds before trying again
        success_threshold: int = 2      # Successes needed to close circuit
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.success_threshold = success_threshold

        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED

        logger.info(
            f"Circuit breaker initialized: "
            f"failure_threshold={failure_threshold}, "
            f"recovery_timeout={recovery_timeout}s"
        )

    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute function with circuit breaker protection.
        """

        # If circuit is open, check if recovery timeout elapsed
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time >= self.recovery_timeout:
                logger.info("Circuit breaker transitioning to HALF_OPEN (testing recovery)")
                self.state = CircuitState.HALF_OPEN
                self.success_count = 0
            else:
                # Circuit still open, fail fast
                logger.warning("Circuit breaker OPEN, rejecting request")
                raise Exception("Circuit breaker is OPEN")

        try:
            # Attempt the call
            result = func(*args, **kwargs)

            # Success - record it
            self._on_success()
            return result

        except Exception as e:
            # Failure - record it
            self._on_failure()
            raise

    def _on_success(self):
        """Handle successful call."""
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1

            # Enough successes to close circuit
            if self.success_count >= self.success_threshold:
                logger.info("Circuit breaker transitioning to CLOSED (service recovered)")
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                self.success_count = 0

        elif self.state == CircuitState.CLOSED:
            # Reset failure count on success
            self.failure_count = 0

    def _on_failure(self):
        """Handle failed call."""
        self.failure_count += 1
        self.last_failure_time = time.time()

        logger.warning(f"Circuit breaker failure count: {self.failure_count}")

        # Open circuit if threshold exceeded
        if self.failure_count >= self.failure_threshold:
            if self.state != CircuitState.OPEN:
                logger.error(
                    f"Circuit breaker transitioning to OPEN "
                    f"(failures: {self.failure_count})"
                )
                self.state = CircuitState.OPEN

# Usage example
import requests

api_circuit_breaker = CircuitBreaker(
    failure_threshold=5,
    recovery_timeout=60,
    success_threshold=2
)

def fetch_user_data(user_id: int):
    """Fetch user data with circuit breaker protection."""

    def _fetch():
        response = requests.get(
            f"https://api.example.com/users/{user_id}",
            timeout=10
        )
        response.raise_for_status()
        return response.json()

    try:
        return api_circuit_breaker.call(_fetch)
    except Exception as e:
        logger.error(f"Failed to fetch user {user_id}: {e}")
        # Return fallback data
        return {"id": user_id, "name": "Unknown", "fallback": True}
```

### Logging

**Network Request Logging:**
```python
# Log network requests with comprehensive context
# Example: HTTP request/response logging

import requests
import logging
import time
import uuid

logger = logging.getLogger(__name__)

def make_http_request(url: str, method: str = 'GET', **kwargs):
    """
    Make HTTP request with comprehensive logging.

    Why this matters:
    - Debugging failed requests
    - Performance monitoring
    - Security auditing
    - Compliance requirements

    Best Practices:
    - Log request details (URL, method, headers)
    - Log response details (status, time, size)
    - Include trace/correlation ID
    - Log errors with full context
    - Don't log sensitive data (passwords, tokens, PII)
    - Structure logs for easy parsing
    """

    # Generate correlation ID for tracing
    correlation_id = str(uuid.uuid4())

    # Add correlation ID to headers
    headers = kwargs.get('headers', {})
    headers['X-Correlation-ID'] = correlation_id
    kwargs['headers'] = headers

    # Log request start
    logger.info(
        "HTTP request started",
        extra={
            'correlation_id': correlation_id,
            'method': method,
            'url': url,
            'headers': _sanitize_headers(headers),  # Remove sensitive headers
            'timeout': kwargs.get('timeout', 'not set')
        }
    )

    start_time = time.time()

    try:
        # Make request
        response = requests.request(method, url, **kwargs)
        duration = time.time() - start_time

        # Log response
        logger.info(
            "HTTP request completed",
            extra={
                'correlation_id': correlation_id,
                'method': method,
                'url': url,
                'status_code': response.status_code,
                'duration_ms': round(duration * 1000, 2),
                'response_size_bytes': len(response.content),
                'success': 200 <= response.status_code < 300
            }
        )

        # Log slow requests
        if duration > 2.0:  # Slower than 2 seconds
            logger.warning(
                "Slow HTTP request detected",
                extra={
                    'correlation_id': correlation_id,
                    'url': url,
                    'duration_ms': round(duration * 1000, 2)
                }
            )

        return response

    except requests.exceptions.Timeout as e:
        duration = time.time() - start_time
        logger.error(
            "HTTP request timeout",
            extra={
                'correlation_id': correlation_id,
                'method': method,
                'url': url,
                'duration_ms': round(duration * 1000, 2),
                'error': str(e)
            }
        )
        raise

    except requests.exceptions.RequestException as e:
        duration = time.time() - start_time
        logger.error(
            "HTTP request failed",
            extra={
                'correlation_id': correlation_id,
                'method': method,
                'url': url,
                'duration_ms': round(duration * 1000, 2),
                'error_type': type(e).__name__,
                'error': str(e)
            }
        )
        raise

def _sanitize_headers(headers: dict) -> dict:
    """
    Remove sensitive information from headers before logging.

    Best Practices:
    - Never log Authorization headers
    - Never log API keys or tokens
    - Mask sensitive values
    """
    sensitive_keys = {'authorization', 'api-key', 'x-api-key', 'cookie', 'password'}

    sanitized = {}
    for key, value in headers.items():
        if key.lower() in sensitive_keys:
            sanitized[key] = '***REDACTED***'
        else:
            sanitized[key] = value

    return sanitized
```

**Connection Monitoring:**
```python
# Monitor network connections and alert on issues
# Example: Database connection monitoring

import psycopg2
import logging
import time
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)

@dataclass
class ConnectionMetrics:
    """Metrics for database connection pool."""
    active_connections: int
    idle_connections: int
    total_connections: int
    max_connections: int
    connection_errors_last_minute: int
    avg_connection_time_ms: float
    timestamp: datetime

class ConnectionMonitor:
    """
    Monitor database connections and alert on issues.

    Why this matters:
    - Detect connection leaks
    - Prevent connection exhaustion
    - Identify performance degradation
    - Enable proactive alerts

    Best Practices:
    - Monitor connection pool utilization
    - Track connection errors
    - Alert when thresholds exceeded
    - Log connection events
    - Include metrics in dashboards
    """

    def __init__(self, pool, alert_threshold: float = 0.8):
        self.pool = pool
        self.alert_threshold = alert_threshold  # Alert at 80% capacity
        self.connection_times = []
        self.error_count = 0
        self.error_window_start = time.time()

    def get_metrics(self) -> ConnectionMetrics:
        """Collect current connection metrics."""

        # Get pool statistics (implementation varies by pool library)
        total = self.pool.maxconn
        idle = len(self.pool._idle_cache) if hasattr(self.pool, '_idle_cache') else 0
        active = total - idle

        # Calculate average connection time
        avg_time = (
            sum(self.connection_times) / len(self.connection_times)
            if self.connection_times else 0
        )

        metrics = ConnectionMetrics(
            active_connections=active,
            idle_connections=idle,
            total_connections=total,
            max_connections=self.pool.maxconn,
            connection_errors_last_minute=self.error_count,
            avg_connection_time_ms=round(avg_time * 1000, 2),
            timestamp=datetime.utcnow()
        )

        # Log metrics
        logger.info(
            "Connection pool metrics",
            extra={
                'active': metrics.active_connections,
                'idle': metrics.idle_connections,
                'total': metrics.total_connections,
                'max': metrics.max_connections,
                'utilization_pct': round(active / total * 100, 1),
                'errors_last_minute': metrics.connection_errors_last_minute,
                'avg_connection_time_ms': metrics.avg_connection_time_ms
            }
        )

        # Check if alert threshold exceeded
        utilization = active / total
        if utilization >= self.alert_threshold:
            logger.warning(
                "High connection pool utilization",
                extra={
                    'utilization_pct': round(utilization * 100, 1),
                    'threshold_pct': round(self.alert_threshold * 100, 1),
                    'active': active,
                    'max': total
                }
            )

        # Reset error count every minute
        if time.time() - self.error_window_start >= 60:
            self.error_count = 0
            self.error_window_start = time.time()

        return metrics

    def record_connection_acquired(self, duration: float):
        """Record successful connection acquisition."""
        self.connection_times.append(duration)

        # Keep only last 100 measurements
        if len(self.connection_times) > 100:
            self.connection_times.pop(0)

        # Log slow connection acquisition
        if duration > 1.0:  # Slower than 1 second
            logger.warning(
                "Slow connection acquisition",
                extra={'duration_ms': round(duration * 1000, 2)}
            )

    def record_connection_error(self, error: Exception):
        """Record connection error."""
        self.error_count += 1

        logger.error(
            "Connection error",
            extra={
                'error_type': type(error).__name__,
                'error': str(error),
                'errors_in_window': self.error_count
            }
        )

        # Alert if many errors
        if self.error_count >= 10:
            logger.critical(
                "High connection error rate",
                extra={'errors_in_last_minute': self.error_count}
            )
```

## Use Cases

### Healthcare: Medical Records System

```
Challenge: Transfer patient data between hospitals securely and reliably

Network Requirements:
- High security (HIPAA compliance)
- Reliable delivery (no data loss)
- Low latency (emergency situations)
- Audit trail (who accessed what when)

Implementation:
1. Network Architecture:
   - Private dedicated network (not public internet)
   - VPN for remote access
   - Redundant connections (if one fails, switch to backup)

2. Protocols:
   - TCP for reliability (every packet confirmed)
   - TLS 1.3 for encryption
   - HL7 or FHIR for medical data format

3. Security:
   - End-to-end encryption
   - Certificate-based authentication
   - Network segmentation (separate medical records from billing)
   - Intrusion detection systems

4. Monitoring:
   - Log every access (who, what, when)
   - Alert on unusual patterns
   - Track network performance

Data Flow:
Doctor's Computer → Hospital Network → VPN → Regional Network → Receiving Hospital

Benefits:
✓ Patient data accessible where needed
✓ HIPAA compliant
✓ Fast access in emergencies
✓ Complete audit trail
```

### E-commerce: Global Online Store

```
Challenge: Serve customers worldwide with fast page loads and reliable transactions

Network Requirements:
- Low latency globally (fast page loads)
- High availability (always accessible)
- Secure transactions (protect payment data)
- Handle traffic spikes (Black Friday)

Implementation:
1. Content Delivery Network (CDN):
   - Cache static content (images, CSS, JS) at edge locations
   - Serve content from server closest to user
   - Reduces latency from 200ms to 20ms

2. Load Balancing:
   - Distribute traffic across multiple servers
   - Health checks (remove failed servers from rotation)
   - Auto-scaling (add servers during high traffic)

3. Database Replication:
   - Primary database for writes
   - Read replicas in each region
   - Faster queries for customers

4. Security:
   - HTTPS everywhere
   - DDoS protection
   - WAF (Web Application Firewall)
   - PCI-DSS compliance for payment processing

Architecture:
                    CDN (Edge Locations Worldwide)
                              ↓
                      Load Balancer
                    ┌─────┴─────┐
                    ↓           ↓
            Web Server 1   Web Server 2
                    └─────┬─────┘
                          ↓
                   Database Cluster
                Primary ← Replicas (US, EU, Asia)

User Experience:
- User in Tokyo: 20ms to nearest edge server
- User in London: 25ms to nearest edge server
- User in New York: 15ms to nearest edge server

Benefits:
✓ Fast page loads globally
✓ Handles millions of concurrent users
✓ No downtime (redundancy)
✓ Secure transactions
```

### Financial Services: Stock Trading Platform

```
Challenge: Execute trades with extremely low latency and zero data loss

Network Requirements:
- Ultra-low latency (microseconds matter)
- Reliable delivery (every order must be processed)
- High throughput (thousands of orders per second)
- Security (protect financial data)

Implementation:
1. Direct Market Access:
   - Dedicated fiber optic connections to exchanges
   - Co-location (servers physically next to exchange)
   - Bypasses public internet entirely

2. Network Optimization:
   - Kernel bypass (bypass OS networking stack)
   - TCP tuning (optimize window size, disable Nagle)
   - Quality of Service (prioritize trading traffic)

3. Redundancy:
   - Multiple network paths
   - Automatic failover (< 1ms)
   - Geographic diversity

4. Monitoring:
   - Microsecond-level latency tracking
   - Packet loss detection
   - Real-time alerts

Latency Breakdown:
Application processing:  50 microseconds
Network transmission:    100 microseconds
Exchange processing:     200 microseconds
Total round trip:        350 microseconds

Compare to typical web request:
Web app: ~100,000 microseconds (100ms)
Trading: ~350 microseconds
Trading is 285x faster!

Why this matters:
- High-frequency trading needs speed
- Milliseconds = millions of dollars
- First order gets best price

Benefits:
✓ Competitive advantage (speed)
✓ More profitable trades
✓ Better prices for customers
✓ Regulatory compliance
```

### Education: Online Learning Platform

```
Challenge: Stream video lectures to thousands of students simultaneously

Network Requirements:
- High bandwidth (video streaming)
- Low latency for live classes
- Reliable delivery (buffer for interruptions)
- Cost-effective (student budgets vary)

Implementation:
1. Adaptive Bitrate Streaming:
   - Multiple video qualities (360p, 720p, 1080p)
   - Automatically adjust based on bandwidth
   - Smooth playback even with slow connections

2. CDN for Video Delivery:
   - Cache videos at edge locations
   - Reduces load on origin server
   - Faster playback, lower costs

3. WebRTC for Live Classes:
   - Real-time video/audio
   - Direct peer-to-peer (when possible)
   - Falls back to server relay when needed

4. Fallback Options:
   - Download for offline viewing
   - Text transcripts
   - Audio-only option

Network Optimization:
Student with 5 Mbps connection:
  - Gets 720p video (smooth)

Student with 1 Mbps connection:
  - Gets 360p video (smooth)
  - Can download for offline (overnight)

Student with unreliable connection:
  - Larger buffer (30 seconds instead of 5)
  - Fewer interruptions

Benefits:
✓ Accessible to students with varying connections
✓ Smooth playback
✓ Live interaction with instructors
✓ Cost-effective at scale
```

### IoT: Smart Building Management

```
Challenge: Monitor and control thousands of sensors and devices in a building

Network Requirements:
- Support many devices (sensors, cameras, locks, HVAC)
- Low power (battery-operated sensors)
- Reliable (security systems must work)
- Secure (prevent unauthorized access)

Implementation:
1. Network Segmentation:
   - IoT network (isolated from corporate network)
   - VLANs for different device types
   - Prevents compromised sensor from accessing corporate data

2. Protocols:
   - MQTT for sensors (lightweight, publish/subscribe)
   - CoAP for constrained devices (like HTTP but smaller)
   - Zigbee/Z-Wave for low-power devices

3. Edge Computing:
   - Local processing (don't send everything to cloud)
   - Faster response (lights respond instantly)
   - Works during internet outages

4. Security:
   - Certificate-based device authentication
   - Encrypted communication
   - Firmware updates over secure channel

Architecture:
Sensors → IoT Gateway → Building Management System → Cloud

Example Devices:
- 500 temperature sensors (send data every 5 minutes)
- 100 motion sensors (send data on event)
- 50 security cameras (stream video continuously)
- 200 smart lights (receive commands)

Network Traffic:
Temperature sensors: 500 * 1 KB every 5 min = 100 KB/5min
Motion sensors: sporadic, ~10 KB/event
Cameras: 50 * 2 Mbps = 100 Mbps continuous
Commands to lights: minimal

Total sustained: ~100 Mbps
Peak: ~150 Mbps (all cameras + sensors)

Benefits:
✓ Energy efficient (optimized HVAC)
✓ Improved security (monitored access)
✓ Predictive maintenance (detect issues early)
✓ Cost savings (20-30% energy reduction)
```

## Common Pitfalls

### Not Handling Network Failures

```
❌ Problem:
Assuming network is always available and reliable

def fetch_data():
    response = requests.get("https://api.example.com/data")
    return response.json()

Why this fails:
- Network can be down (outage)
- Server can be unreachable (timeout)
- Connection can be reset (interrupted)

Result: Application crashes

✓ Solution:
Always handle network errors and implement retries

def fetch_data():
    try:
        response = requests.get(
            "https://api.example.com/data",
            timeout=10  # Don't wait forever
        )
        response.raise_for_status()  # Check for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch data: {e}")
        # Return default or retry
        return None
```

### Ignoring Timeouts

```
❌ Problem:
Not setting timeouts on network operations

conn = socket.socket()
conn.connect(("example.com", 80))  # Can block forever!

Why this fails:
- Hangs indefinitely if server doesn't respond
- Consumes resources (threads, connections)
- User sees frozen application

✓ Solution:
Always set appropriate timeouts

conn = socket.socket()
conn.settimeout(10)  # 10 second timeout
try:
    conn.connect(("example.com", 80))
except socket.timeout:
    logger.error("Connection timed out")
    # Handle gracefully
```

### Hardcoding IP Addresses

```
❌ Problem:
Using IP addresses instead of domain names

DATABASE_HOST = "203.0.113.45"

Why this fails:
- IP addresses change (server migration)
- Can't use load balancing
- No failover capability
- Harder to maintain

✓ Solution:
Use domain names and DNS

DATABASE_HOST = "db.example.com"

Benefits:
- Update DNS to point to new IP (no code change)
- Load balancer can distribute traffic
- Automatic failover
```

### Not Encrypting Sensitive Data

```
❌ Problem:
Sending sensitive data over unencrypted connections

response = requests.get("http://api.example.com/user/password")

Why this fails:
- Anyone on network can see data (packet sniffing)
- Violates compliance requirements (PCI-DSS, HIPAA)
- Vulnerable to man-in-the-middle attacks

✓ Solution:
Always use HTTPS for sensitive data

response = requests.get(
    "https://api.example.com/user/password",
    verify=True  # Verify SSL certificate
)
```

### Inefficient Connection Usage

```
❌ Problem:
Creating new connection for every request

def get_user(user_id):
    conn = database.connect()  # New connection every time!
    user = conn.query(f"SELECT * FROM users WHERE id = {user_id}")
    conn.close()
    return user

Why this fails:
- Slow (connection setup takes time)
- Wasteful (TCP handshake, auth for each request)
- Can exhaust connection limits

✓ Solution:
Use connection pooling

# Create pool once
pool = create_connection_pool(size=10)

def get_user(user_id):
    conn = pool.get_connection()  # Reuse existing connection
    try:
        user = conn.query(f"SELECT * FROM users WHERE id = {user_id}")
        return user
    finally:
        pool.return_connection(conn)  # Return to pool
```

### Ignoring Network Latency

```
❌ Problem:
Making multiple sequential network calls (N+1 problem)

def get_users_with_posts():
    users = fetch_all_users()  # 1 network call
    for user in users:
        user.posts = fetch_posts(user.id)  # N network calls
    return users

If 100 users: 101 network calls, each taking 50ms = 5+ seconds!

✓ Solution:
Batch requests or use caching

def get_users_with_posts():
    users = fetch_all_users()  # 1 call
    user_ids = [u.id for u in users]
    all_posts = fetch_posts_for_users(user_ids)  # 1 call (batched)

    # Associate posts with users
    for user in users:
        user.posts = [p for p in all_posts if p.user_id == user.id]
    return users

Total: 2 network calls, ~100ms instead of 5+ seconds
```

### Not Monitoring Network Issues

```
❌ Problem:
No visibility into network problems until users complain

Why this fails:
- Can't diagnose issues
- Don't know if problems are widespread
- Can't proactively fix issues
- SLA violations

✓ Solution:
Implement comprehensive monitoring

import logging
from datadog import statsd

def make_request(url):
    start = time.time()
    try:
        response = requests.get(url, timeout=10)
        duration = time.time() - start

        # Track metrics
        statsd.timing('http.request.duration', duration)
        statsd.increment('http.request.success')

        # Log slow requests
        if duration > 2.0:
            logger.warning(f"Slow request: {url} took {duration}s")

        return response

    except Exception as e:
        # Track failures
        statsd.increment('http.request.failure')
        logger.error(f"Request failed: {url} - {e}")
        raise

Benefits:
✓ Dashboards show request latency trends
✓ Alerts when error rate increases
✓ Can identify and fix issues proactively
```

### Exposing Internal Services

```
❌ Problem:
Internal services accessible from internet

Database port 5432 open to 0.0.0.0/0

Why this fails:
- Security vulnerability (unauthorized access)
- Exposure to attacks (brute force, exploits)
- Compliance violations

✓ Solution:
Use firewalls and network segmentation

# Only allow database access from application servers
Firewall rule:
  Port 5432
  Source: 10.0.2.0/24 (application subnet only)
  Destination: 10.0.3.0/24 (database subnet)

Public internet → Cannot reach database
Application servers → Can reach database

Benefits:
✓ Reduced attack surface
✓ Defense in depth
✓ Compliance (PCI-DSS requirement)
```

## Quick Reference

### Common Networking Commands

```bash
# Test connectivity
ping google.com                 # Test if host is reachable
ping -c 4 google.com            # Send 4 packets and stop

# Trace route
traceroute google.com           # Show path packets take (Linux/Mac)
tracert google.com              # Windows version

# DNS lookup
nslookup google.com             # Simple DNS query
dig google.com                  # Detailed DNS query (Linux/Mac)
dig google.com +short           # Just show IP address

# Show network connections
netstat -an                     # All connections and listening ports
netstat -tuln                   # TCP/UDP listening ports (Linux)
ss -tuln                        # Modern alternative to netstat (Linux)

# Show routing table
route -n                        # Linux
netstat -rn                     # Mac/BSD
route print                     # Windows

# Network interfaces
ifconfig                        # Show network interfaces (Linux/Mac)
ipconfig                        # Windows version
ip addr show                    # Modern Linux alternative

# Port scanning
nmap -p 80,443 example.com      # Check if ports are open
nc -zv example.com 80           # Test specific port

# Bandwidth testing
iperf3 -s                       # Run server (on one machine)
iperf3 -c <server-ip>           # Run client (on another machine)

# Packet capture
tcpdump -i eth0                 # Capture packets on interface
tcpdump -i eth0 port 80         # Capture only HTTP traffic
wireshark                       # GUI packet analyzer
```

### OSI Model Layers

| Layer | Name         | Function                    | Examples                  | Troubleshooting         |
| ----- | ------------ | --------------------------- | ------------------------- | ----------------------- |
| 7     | Application  | User-facing protocols       | HTTP, FTP, SMTP, DNS      | Check application logs  |
| 6     | Presentation | Data formatting, encryption | SSL/TLS, JPEG, ASCII      | Check encoding/certs    |
| 5     | Session      | Connection management       | NetBIOS, RPC              | Check session state     |
| 4     | Transport    | Reliable delivery           | TCP, UDP                  | Check ports, firewalls  |
| 3     | Network      | Routing between networks    | IP, ICMP, routing         | Check routes, ping      |
| 2     | Data Link    | Node-to-node transfer       | Ethernet, Wi-Fi, switches | Check MAC, switch ports |
| 1     | Physical     | Physical transmission       | Cables, radio waves       | Check cables, signals   |

### Common Port Numbers

| Port  | Service          | Protocol | Description               |
| ----- | ---------------- | -------- | ------------------------- |
| 20/21 | FTP              | TCP      | File Transfer Protocol    |
| 22    | SSH              | TCP      | Secure Shell              |
| 23    | Telnet           | TCP      | Unencrypted remote access |
| 25    | SMTP             | TCP      | Email sending             |
| 53    | DNS              | UDP/TCP  | Domain Name System        |
| 67/68 | DHCP             | UDP      | Dynamic IP assignment     |
| 80    | HTTP             | TCP      | Web traffic               |
| 110   | POP3             | TCP      | Email retrieval           |
| 143   | IMAP             | TCP      | Email access              |
| 443   | HTTPS            | TCP      | Secure web traffic        |
| 465   | SMTPS            | TCP      | Secure email              |
| 993   | IMAPS            | TCP      | Secure IMAP               |
| 995   | POP3S            | TCP      | Secure POP3               |
| 3306  | MySQL            | TCP      | MySQL database            |
| 3389  | RDP              | TCP      | Windows Remote Desktop    |
| 5432  | PostgreSQL       | TCP      | PostgreSQL database       |
| 6379  | Redis            | TCP      | Redis cache               |
| 8080  | HTTP Alternative | TCP      | Development web server    |
| 27017 | MongoDB          | TCP      | MongoDB database          |

### IP Address Ranges

| Range                         | Purpose              | Scope      |
| ----------------------------- | -------------------- | ---------- |
| 10.0.0.0 - 10.255.255.255     | Private (Class A)    | Large orgs |
| 172.16.0.0 - 172.31.255.255   | Private (Class B)    | Medium     |
| 192.168.0.0 - 192.168.255.255 | Private (Class C)    | Home/small |
| 127.0.0.0 - 127.255.255.255   | Loopback (localhost) | Local      |
| 169.254.0.0 - 169.254.255.255 | Link-local (APIPA)   | Auto-assigned when DHCP fails |
| 224.0.0.0 - 239.255.255.255   | Multicast            | Group communication |

### Troubleshooting Flowchart

```
Network problem?
      ↓
Can you ping 127.0.0.1 (localhost)?
  No → Network stack broken, restart
  Yes ↓
      ↓
Can you ping default gateway (router)?
  No → Check cable, Wi-Fi, network interface
  Yes ↓
      ↓
Can you ping external IP (e.g., 8.8.8.8)?
  No → Router issue or ISP problem
  Yes ↓
      ↓
Can you resolve DNS (nslookup google.com)?
  No → DNS issue, try different DNS server
  Yes ↓
      ↓
Can you reach service (curl https://example.com)?
  No → Firewall, service down, or routing issue
  Yes → Problem is in application layer
```

### Network Performance Metrics

| Metric      | Good        | Acceptable | Poor        | Critical    |
| ----------- | ----------- | ---------- | ----------- | ----------- |
| Latency     | < 50ms      | 50-150ms   | 150-300ms   | > 300ms     |
| Jitter      | < 10ms      | 10-30ms    | 30-50ms     | > 50ms      |
| Packet Loss | < 0.1%      | 0.1-1%     | 1-3%        | > 3%        |
| Throughput  | > 90% max   | 70-90%     | 50-70%      | < 50%       |
| Uptime      | > 99.99%    | 99.9-99.99%| 99-99.9%    | < 99%       |

## Related Topics

### In This Repository

- **00-foundations/how-internet-works/README.md**: How data travels across the internet
- **00-foundations/data-basics/README.md**: How data is structured and transmitted
- **08-security/network-security/README.md**: Securing network communications
- **06-infrastructure/load-balancing/README.md**: Distributing network traffic
- **07-cloud/networking/README.md**: Cloud networking concepts (VPC, subnets)

### External Resources

**Beginner:**
- Computer Networking: A Top-Down Approach (Kurose & Ross)
- Professor Messer's Network+ Course (free videos)
- Practical Networking YouTube channel

**Intermediate:**
- TCP/IP Illustrated (Stevens)
- Wireshark Network Analysis book
- High Performance Browser Networking (free online)

**Advanced:**
- Network Programmability and Automation (O'Reilly)
- Software-Defined Networking concepts
- BGP routing and internet architecture

**Tools to Explore:**
- Wireshark: Packet analysis
- GNS3 or EVE-NG: Network simulation
- PacketTracer: Cisco network simulator (free)
- nmap: Network discovery and security auditing

**Standards and RFCs:**
- RFC 791: Internet Protocol (IP)
- RFC 793: Transmission Control Protocol (TCP)
- RFC 768: User Datagram Protocol (UDP)
- RFC 2616: HTTP/1.1
- RFC 1918: Private address space

---

This networking guide provides the foundation for understanding how computers communicate. Every modern application relies on these concepts—from simple websites to complex distributed systems. Master these fundamentals, and you'll be able to troubleshoot issues, design better systems, and understand how the internet actually works under the hood.
