import matplotlib.pyplot as plt
from datetime import datetime

file_bytes = [10000,
              20000,
              30000,
              40000,
              50000,
              100000,
              150000,
              200000,
              ]

upload_time = [
    "954.218ms",
    "1.171s",
    "1.565s",
    "2.029s",
    "2.163s",
    "4.379s",
    "6.369s",
    "8.338s"
]

download_time = [
    "11.592ms",
    "17.675ms",
    "27.489ms",
    "31.47ms",
    "34.236ms",
    "68.164ms",
    "95.255ms",
    "119.586ms",
]

for i in range(len(upload_time)):
    if upload_time[i].endswith("ms"):
        upload_time[i] = float(upload_time[i][:-2]) / 1000
    else:
        upload_time[i] = float(upload_time[i][:-1])
        
for i in range(len(download_time)):
    if download_time[i].endswith("ms"):
        download_time[i] = float(download_time[i][:-2])

plt.plot(file_bytes, upload_time)
plt.ylabel("Time (s)")
plt.xlabel("File Size (Bytes)")
plt.title("Upload Time on Two Node Cluster")
plt.show()

plt.plot(file_bytes, download_time)
plt.ylabel("Time (ms)")
plt.xlabel("File Size (Bytes)")
plt.title("Download Time on Two Node Cluster")
plt.show()