# Comprehensive Guide to Anomaly Detection

## 📋 Table of Contents

1. [Introduction to Anomaly Detection](#introduction-to-anomaly-detection)
2. [Global vs Local Detectors](#global-vs-local-detectors)
3. [Forward Pass and Backward Pass](#forward-pass-and-backward-pass)
4. [Statistical Methods](#statistical-methods)
5. [Machine Learning Methods](#machine-learning-methods)
6. [Deep Learning Methods](#deep-learning-methods)
7. [Time-Series Anomaly Detection](#time-series-anomaly-detection)
8. [Real-World Examples](#real-world-examples)
9. [Best Practices](#best-practices)

---

## Introduction to Anomaly Detection

### What is Anomaly Detection?

Anomaly detection (also called outlier detection) is the identification of rare items, events, or observations that differ significantly from the majority of the data.

**Types of Anomalies**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Types of Anomalies                        │
└─────────────────────────────────────────────────────────────┘

1. Point Anomalies (Global Outliers)
   Single data points that deviate from normal patterns
   Example: A $10,000 transaction when typical is $50

2. Contextual Anomalies (Conditional Outliers)
   Anomalous in specific context, normal in others
   Example: High CPU usage is normal during batch jobs,
            but anomalous at 3 AM

3. Collective Anomalies (Group Outliers)
   Collection of points that together are anomalous
   Example: A sequence of failed login attempts from
            different locations
```

### Basic Example: Understanding Anomalies

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Generate normal data with some outliers
np.random.seed(42)
normal_data = np.random.normal(loc=50, scale=10, size=950)
outliers = np.array([120, 130, 5, 150, 10])  # Clear outliers
data = np.concatenate([normal_data, outliers])

# Simple statistical method: Z-score
def detect_outliers_zscore(data, threshold=3):
    """
    Detect outliers using Z-score method
    Z-score > threshold indicates outlier
    """
    z_scores = np.abs(stats.zscore(data))
    outlier_indices = np.where(z_scores > threshold)[0]
    return outlier_indices

# Detect outliers
outlier_idx = detect_outliers_zscore(data)
print(f"Detected {len(outlier_idx)} outliers")
print(f"Outlier values: {data[outlier_idx]}")

# Visualize
plt.figure(figsize=(12, 5))

# Histogram
plt.subplot(1, 2, 1)
plt.hist(data, bins=50, alpha=0.7, edgecolor='black')
plt.axvline(x=np.mean(data) + 3*np.std(data), color='r', linestyle='--', label='3σ threshold')
plt.axvline(x=np.mean(data) - 3*np.std(data), color='r', linestyle='--')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.title('Data Distribution with Outliers')
plt.legend()

# Scatter plot
plt.subplot(1, 2, 2)
plt.scatter(range(len(data)), data, alpha=0.5, label='Normal')
plt.scatter(outlier_idx, data[outlier_idx], color='red', s=100, label='Outliers')
plt.xlabel('Index')
plt.ylabel('Value')
plt.title('Data Points with Outliers Highlighted')
plt.legend()

plt.tight_layout()
plt.savefig('/tmp/basic_anomaly_detection.png', dpi=300)
print("✅ Basic anomaly detection complete!")
```

**Output Explanation**:

- **Z-score > 3**: Points more than 3 standard deviations from mean
- **Red points**: Detected anomalies
- **Why it works**: Normal distribution → 99.7% of data within 3σ

---

## Global vs Local Detectors

### Understanding the Difference

```
┌─────────────────────────────────────────────────────────────┐
│                 Global vs Local Detection                    │
└─────────────────────────────────────────────────────────────┘

GLOBAL DETECTOR:
- Considers entire dataset as a single distribution
- Finds points that deviate from overall pattern
- Good for: Simple distributions, global outliers
- Examples: Z-score, Median Absolute Deviation

LOCAL DETECTOR:
- Considers local neighborhood of each point
- Finds points that deviate from local pattern
- Good for: Complex distributions, local outliers
- Examples: LOF (Local Outlier Factor), DBSCAN
```

### Example: Global Detector (Z-Score)

```python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# Generate data with multiple clusters
np.random.seed(42)

# Cluster 1: Center at (0, 0)
cluster1 = np.random.normal(loc=[0, 0], scale=1, size=(300, 2))

# Cluster 2: Center at (10, 10)
cluster2 = np.random.normal(loc=[10, 10], scale=1, size=(300, 2))

# Outliers
outliers = np.array([[5, 5], [15, 0], [-5, 10], [20, 20]])

# Combine data
data = np.vstack([cluster1, cluster2, outliers])

# Global Detector: Z-Score
def global_detector_zscore(data, threshold=3):
    """
    Global detector using Z-score
    Treats all data as single distribution
    """
    z_scores = np.abs(stats.zscore(data, axis=0))
    # A point is anomaly if either dimension has high z-score
    outlier_mask = np.any(z_scores > threshold, axis=1)
    return outlier_mask

global_outliers = global_detector_zscore(data)

# Visualize
plt.figure(figsize=(10, 8))
plt.scatter(data[~global_outliers, 0], data[~global_outliers, 1],
           alpha=0.5, label='Normal', s=50)
plt.scatter(data[global_outliers, 0], data[global_outliers, 1],
           color='red', label='Global Outliers', s=200, marker='X')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('Global Detector (Z-Score)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('/tmp/global_detector.png', dpi=300)

print(f"Global detector found {global_outliers.sum()} outliers")
```

### Example: Local Detector (LOF - Local Outlier Factor)

```python
from sklearn.neighbors import LocalOutlierFactor

# Local Detector: LOF
def local_detector_lof(data, n_neighbors=20, contamination=0.01):
    """
    Local detector using LOF
    Considers local density of points

    Parameters:
    - n_neighbors: Number of neighbors to consider
    - contamination: Expected proportion of outliers
    """
    lof = LocalOutlierFactor(n_neighbors=n_neighbors, contamination=contamination)
    outlier_labels = lof.fit_predict(data)

    # -1 for outliers, 1 for inliers
    outlier_mask = outlier_labels == -1

    # Get anomaly scores (more negative = more anomalous)
    anomaly_scores = -lof.negative_outlier_factor_

    return outlier_mask, anomaly_scores

local_outliers, lof_scores = local_detector_lof(data, n_neighbors=20)

# Visualize
plt.figure(figsize=(10, 8))

# Color by LOF score
scatter = plt.scatter(data[:, 0], data[:, 1],
                     c=lof_scores, cmap='RdYlGn_r',
                     alpha=0.6, s=50)
plt.scatter(data[local_outliers, 0], data[local_outliers, 1],
           edgecolors='red', facecolors='none',
           linewidths=3, s=200, label='Local Outliers')

plt.colorbar(scatter, label='LOF Score (higher = more anomalous)')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('Local Detector (LOF)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('/tmp/local_detector.png', dpi=300)

print(f"Local detector found {local_outliers.sum()} outliers")
```

### Comparison: When to Use Each

```python
# Comparison on same dataset
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Global detector
ax1 = axes[0]
ax1.scatter(data[~global_outliers, 0], data[~global_outliers, 1],
           alpha=0.5, label='Normal', s=50)
ax1.scatter(data[global_outliers, 0], data[global_outliers, 1],
           color='red', label='Outliers', s=200, marker='X')
ax1.set_xlabel('Feature 1')
ax1.set_ylabel('Feature 2')
ax1.set_title('Global Detector (Z-Score)\nFinds points far from overall mean')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Local detector
ax2 = axes[1]
scatter = ax2.scatter(data[:, 0], data[:, 1],
                     c=lof_scores, cmap='RdYlGn_r',
                     alpha=0.6, s=50)
ax2.scatter(data[local_outliers, 0], data[local_outliers, 1],
           edgecolors='red', facecolors='none',
           linewidths=3, s=200, label='Outliers')
plt.colorbar(scatter, ax=ax2, label='LOF Score')
ax2.set_xlabel('Feature 1')
ax2.set_ylabel('Feature 2')
ax2.set_title('Local Detector (LOF)\nFinds points with low local density')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('/tmp/global_vs_local_comparison.png', dpi=300)

print("\n=== Comparison ===")
print(f"Global detector: {global_outliers.sum()} outliers")
print(f"Local detector: {local_outliers.sum()} outliers")
print("\nKey Insight:")
print("- Global detector misses outliers within dense clusters")
print("- Local detector finds points that are isolated from neighbors")
```

**When to Use**:

| Scenario                    | Global Detector          | Local Detector    |
| --------------------------- | ------------------------ | ----------------- |
| Single cluster/distribution | ✅ Preferred             | ❌ Overkill       |
| Multiple clusters           | ❌ Misses local outliers | ✅ Preferred      |
| Uniform density             | ✅ Sufficient            | ❌ Unnecessary    |
| Varying density             | ❌ Struggles             | ✅ Handles well   |
| Computational cost          | ✅ Fast (O(n))           | ❌ Slower (O(n²)) |
| Interpretability            | ✅ Easy                  | ❌ Complex        |

---

## Forward Pass and Backward Pass

### Understanding Forward and Backward Passes

In deep learning-based anomaly detection, **forward pass** and **backward pass** refer to different stages of model training and inference:

```
┌─────────────────────────────────────────────────────────────┐
│          Forward Pass vs Backward Pass                       │
└─────────────────────────────────────────────────────────────┘

FORWARD PASS (Inference/Prediction):
┌──────┐      ┌──────┐      ┌──────┐      ┌──────────┐
│ Input│ ───▶ │Hidden│ ───▶ │Output│ ───▶ │Prediction│
│ Data │      │Layers│      │Layer │      │  Score   │
└──────┘      └──────┘      └──────┘      └──────────┘

Purpose:
- Make predictions on new data
- Calculate anomaly scores
- Used in production inference

BACKWARD PASS (Training):
┌──────┐      ┌──────┐      ┌──────┐      ┌──────────┐
│ Loss │ ◀─── │Hidden│ ◀─── │Output│ ◀─── │Prediction│
│Gradnt│      │Layers│      │Layer │      │   vs     │
└──────┘      └──────┘      └──────┘      │  Actual  │
                                          └──────────┘
Purpose:
- Calculate gradients
- Update model weights
- Learn normal patterns
```

### Example 1: Autoencoder for Anomaly Detection

An **autoencoder** learns to reconstruct normal data. Anomalies have high reconstruction error.

```python
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from sklearn.preprocessing import StandardScaler

# Define Autoencoder
class Autoencoder(nn.Module):
    def __init__(self, input_dim, encoding_dim):
        super(Autoencoder, self).__init__()

        # Encoder (Forward pass: compress data)
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, encoding_dim),
            nn.ReLU()
        )

        # Decoder (Forward pass: reconstruct data)
        self.decoder = nn.Sequential(
            nn.Linear(encoding_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 64),
            nn.ReLU(),
            nn.Linear(64, input_dim)
        )

    def forward(self, x):
        """
        Forward pass: Encode then Decode
        """
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

# Generate training data (normal data only)
np.random.seed(42)
normal_data = np.random.normal(loc=0, scale=1, size=(1000, 10))

# Generate test data (normal + anomalies)
test_normal = np.random.normal(loc=0, scale=1, size=(900, 10))
test_anomalies = np.random.normal(loc=5, scale=2, size=(100, 10))  # Different distribution
test_data = np.vstack([test_normal, test_anomalies])
test_labels = np.array([0]*900 + [1]*100)  # 0=normal, 1=anomaly

# Standardize data
scaler = StandardScaler()
normal_data_scaled = scaler.fit_transform(normal_data)
test_data_scaled = scaler.transform(test_data)

# Convert to PyTorch tensors
X_train = torch.FloatTensor(normal_data_scaled)
X_test = torch.FloatTensor(test_data_scaled)

# Initialize model
input_dim = 10
encoding_dim = 4
model = Autoencoder(input_dim, encoding_dim)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop (Forward + Backward passes)
print("Training Autoencoder...")
num_epochs = 50
batch_size = 32

for epoch in range(num_epochs):
    model.train()
    total_loss = 0

    # Mini-batch training
    for i in range(0, len(X_train), batch_size):
        batch = X_train[i:i+batch_size]

        # ============== FORWARD PASS ==============
        # 1. Pass data through encoder
        # 2. Pass encoded data through decoder
        # 3. Get reconstruction
        reconstructed = model(batch)

        # 4. Calculate reconstruction error (loss)
        loss = criterion(reconstructed, batch)

        # ============== BACKWARD PASS ==============
        # 5. Zero gradients from previous iteration
        optimizer.zero_grad()

        # 6. Compute gradients (backward pass through network)
        loss.backward()  # This is where backward pass happens!

        # 7. Update weights using gradients
        optimizer.step()

        total_loss += loss.item()

    if (epoch + 1) % 10 == 0:
        avg_loss = total_loss / (len(X_train) / batch_size)
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {avg_loss:.6f}")

# Inference (Forward pass only)
print("\nPerforming anomaly detection...")
model.eval()

with torch.no_grad():
    # ============== FORWARD PASS (Inference) ==============
    # No backward pass during inference!
    reconstructed_test = model(X_test)

    # Calculate reconstruction error for each sample
    reconstruction_errors = torch.mean((X_test - reconstructed_test) ** 2, dim=1).numpy()

# Determine threshold (e.g., 95th percentile of training reconstruction errors)
with torch.no_grad():
    train_reconstructed = model(X_train)
    train_errors = torch.mean((X_train - train_reconstructed) ** 2, dim=1).numpy()
    threshold = np.percentile(train_errors, 95)

# Classify anomalies
predictions = (reconstruction_errors > threshold).astype(int)

# Evaluate
from sklearn.metrics import classification_report, confusion_matrix

print("\n=== Results ===")
print(f"Threshold: {threshold:.4f}")
print(f"\nClassification Report:")
print(classification_report(test_labels, predictions, target_names=['Normal', 'Anomaly']))

# Visualize reconstruction errors
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.hist(reconstruction_errors[test_labels == 0], bins=50, alpha=0.7, label='Normal', edgecolor='black')
plt.hist(reconstruction_errors[test_labels == 1], bins=50, alpha=0.7, label='Anomaly', edgecolor='black')
plt.axvline(x=threshold, color='red', linestyle='--', linewidth=2, label='Threshold')
plt.xlabel('Reconstruction Error')
plt.ylabel('Frequency')
plt.title('Distribution of Reconstruction Errors')
plt.legend()
plt.grid(True, alpha=0.3)

plt.subplot(1, 2, 2)
plt.scatter(range(len(reconstruction_errors)), reconstruction_errors,
           c=test_labels, cmap='RdYlGn_r', alpha=0.6)
plt.axhline(y=threshold, color='red', linestyle='--', linewidth=2, label='Threshold')
plt.xlabel('Sample Index')
plt.ylabel('Reconstruction Error')
plt.title('Reconstruction Error per Sample')
plt.colorbar(label='True Label (0=Normal, 1=Anomaly)')
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('/tmp/autoencoder_anomaly_detection.png', dpi=300)

print("\n✅ Forward/Backward pass example complete!")
```

**Key Insights**:

1. **Forward Pass (Training)**:
   - Input → Encoder → Latent representation → Decoder → Reconstruction
   - Compute loss (reconstruction error)

2. **Backward Pass (Training)**:
   - Compute gradients of loss w.r.t. all parameters
   - Propagate gradients backward through network
   - Update weights to minimize reconstruction error

3. **Forward Pass (Inference)**:
   - Only forward pass, no backward pass
   - Use reconstruction error as anomaly score
   - High error → Anomaly

### Example 2: LSTM for Time-Series Anomaly Detection

```python
import torch
import torch.nn as nn
import numpy as np

class LSTM_Autoencoder(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers=2):
        super(LSTM_Autoencoder, self).__init__()

        self.hidden_dim = hidden_dim
        self.num_layers = num_layers

        # Encoder LSTM
        self.encoder = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True
        )

        # Decoder LSTM
        self.decoder = nn.LSTM(
            input_size=hidden_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True
        )

        # Output layer
        self.output_layer = nn.Linear(hidden_dim, input_dim)

    def forward(self, x):
        """
        Forward pass through LSTM autoencoder

        Args:
            x: Input sequence [batch_size, seq_len, input_dim]

        Returns:
            reconstructed: Reconstructed sequence
        """
        batch_size, seq_len, _ = x.size()

        # ============== ENCODER (Forward Pass) ==============
        # Encode the entire sequence
        encoded, (hidden, cell) = self.encoder(x)

        # Take the last hidden state as the compressed representation
        compressed = encoded[:, -1:, :]  # [batch_size, 1, hidden_dim]

        # ============== DECODER (Forward Pass) ==============
        # Repeat compressed representation for each time step
        decoder_input = compressed.repeat(1, seq_len, 1)

        # Decode
        decoded, _ = self.decoder(decoder_input)

        # Project back to input dimension
        reconstructed = self.output_layer(decoded)

        return reconstructed

# Generate synthetic time-series data
def generate_time_series(n_samples=1000, seq_len=50, n_features=3):
    """
    Generate normal time-series data (sinusoidal patterns)
    """
    t = np.linspace(0, 100, seq_len)
    data = []

    for _ in range(n_samples):
        # Multiple sinusoidal components with noise
        freq1 = np.random.uniform(0.5, 2.0)
        freq2 = np.random.uniform(0.5, 2.0)
        freq3 = np.random.uniform(0.5, 2.0)

        series = np.column_stack([
            np.sin(freq1 * t) + np.random.normal(0, 0.1, seq_len),
            np.sin(freq2 * t) + np.random.normal(0, 0.1, seq_len),
            np.sin(freq3 * t) + np.random.normal(0, 0.1, seq_len)
        ])

        data.append(series)

    return np.array(data)

# Generate anomalous time-series
def generate_anomalies(n_samples=100, seq_len=50, n_features=3):
    """
    Generate anomalous time-series (different patterns)
    """
    data = []

    for _ in range(n_samples):
        # Different patterns: spikes, flat lines, random walk
        anomaly_type = np.random.choice(['spike', 'flat', 'random'])

        if anomaly_type == 'spike':
            # Sudden spikes
            series = np.random.normal(0, 0.1, (seq_len, n_features))
            spike_idx = np.random.randint(10, seq_len-10)
            series[spike_idx] = np.random.uniform(3, 5, n_features)
        elif anomaly_type == 'flat':
            # Flat line (no variation)
            series = np.ones((seq_len, n_features)) * np.random.uniform(-1, 1, n_features)
        else:
            # Random walk
            series = np.cumsum(np.random.normal(0, 0.3, (seq_len, n_features)), axis=0)

        data.append(series)

    return np.array(data)

# Prepare data
print("Generating time-series data...")
train_data = generate_time_series(n_samples=800, seq_len=50, n_features=3)
test_normal = generate_time_series(n_samples=180, seq_len=50, n_features=3)
test_anomalies = generate_anomalies(n_samples=20, seq_len=50, n_features=3)

test_data = np.vstack([test_normal, test_anomalies])
test_labels = np.array([0]*180 + [1]*20)

# Convert to tensors
X_train = torch.FloatTensor(train_data)
X_test = torch.FloatTensor(test_data)

# Initialize model
model = LSTM_Autoencoder(input_dim=3, hidden_dim=16, num_layers=2)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training
print("\nTraining LSTM Autoencoder...")
num_epochs = 30

for epoch in range(num_epochs):
    model.train()

    # ============== FORWARD PASS ==============
    reconstructed = model(X_train)
    loss = criterion(reconstructed, X_train)

    # ============== BACKWARD PASS ==============
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.6f}")

# Inference
print("\nDetecting anomalies...")
model.eval()

with torch.no_grad():
    reconstructed_test = model(X_test)
    reconstruction_errors = torch.mean((X_test - reconstructed_test) ** 2, dim=(1, 2)).numpy()

# Set threshold
with torch.no_grad():
    train_reconstructed = model(X_train)
    train_errors = torch.mean((X_train - train_reconstructed) ** 2, dim=(1, 2)).numpy()
    threshold = np.percentile(train_errors, 95)

predictions = (reconstruction_errors > threshold).astype(int)

print("\n=== LSTM Autoencoder Results ===")
print(f"Threshold: {threshold:.4f}")
print(f"\nClassification Report:")
print(classification_report(test_labels, predictions, target_names=['Normal', 'Anomaly']))

print("\n✅ LSTM time-series anomaly detection complete!")
```

---

_Continue to [Statistical Methods](#statistical-methods)_

## Statistical Methods

### 1. Z-Score (Standard Score)

**Concept**: Measures how many standard deviations a point is from the mean.

**Formula**:

```
z = (x - μ) / σ

where:
- x: data point
- μ: mean
- σ: standard deviation
```

**Example**:

```python
from scipy import stats
import numpy as np

def zscore_anomaly_detection(data, threshold=3):
    """
    Detect anomalies using Z-score

    Parameters:
    - data: Input data
    - threshold: Z-score threshold (default=3)

    Returns:
    - is_anomaly: Boolean array
    - z_scores: Z-scores for each point
    """
    z_scores = np.abs(stats.zscore(data))
    is_anomaly = z_scores > threshold

    return is_anomaly, z_scores

# Example usage
data = np.concatenate([
    np.random.normal(50, 10, 1000),  # Normal data
    np.array([150, 10, 180, 5])  # Outliers
])

is_anomaly, z_scores = zscore_anomaly_detection(data)

print(f"Total points: {len(data)}")
print(f"Anomalies detected: {is_anomaly.sum()}")
print(f"Anomalous values: {data[is_anomaly]}")
```

**Pros**:

- ✅ Simple and fast
- ✅ Works well for Gaussian distributions
- ✅ Easy to interpret

**Cons**:

- ❌ Sensitive to outliers (they affect mean and std)
- ❌ Assumes normal distribution
- ❌ Not suitable for multimodal distributions

### 2. Modified Z-Score (Robust)

Uses median and MAD (Median Absolute Deviation) instead of mean and std.

```python
def modified_zscore_anomaly_detection(data, threshold=3.5):
    """
    Robust anomaly detection using Modified Z-score
    Based on median and MAD instead of mean and std

    Modified Z-score = 0.6745 * (x - median) / MAD
    """
    median = np.median(data)
    mad = np.median(np.abs(data - median))

    # Avoid division by zero
    if mad == 0:
        mad = np.mean(np.abs(data - median))

    modified_z_scores = 0.6745 * (data - median) / mad
    is_anomaly = np.abs(modified_z_scores) > threshold

    return is_anomaly, modified_z_scores

# Example
is_anomaly_robust, mz_scores = modified_zscore_anomaly_detection(data)

print(f"Robust method - Anomalies: {is_anomaly_robust.sum()}")
```

**Advantage**: More robust to outliers than standard Z-score.

### 3. Interquartile Range (IQR)

**Concept**: Uses quartiles to identify outliers.

```python
def iqr_anomaly_detection(data, k=1.5):
    """
    Detect anomalies using IQR method

    Parameters:
    - k: IQR multiplier (1.5 = mild outliers, 3.0 = extreme outliers)

    Returns:
    - is_anomaly: Boolean array
    """
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1

    lower_bound = Q1 - k * IQR
    upper_bound = Q3 + k * IQR

    is_anomaly = (data < lower_bound) | (data > upper_bound)

    return is_anomaly, lower_bound, upper_bound

# Example
is_anomaly_iqr, lower, upper = iqr_anomaly_detection(data)

print(f"IQR bounds: [{lower:.2f}, {upper:.2f}]")
print(f"IQR method - Anomalies: {is_anomaly_iqr.sum()}")
```

### 4. Grubbs' Test (for Single Outlier)

Statistical test for detecting a single outlier.

```python
from scipy import stats

def grubbs_test(data, alpha=0.05):
    """
    Grubbs' test for detecting single outlier

    Null hypothesis: No outliers in data
    """
    n = len(data)
    mean = np.mean(data)
    std = np.std(data, ddof=1)

    # Find point with maximum absolute deviation from mean
    abs_dev = np.abs(data - mean)
    max_idx = np.argmax(abs_dev)
    max_dev = abs_dev[max_idx]

    # Grubbs' statistic
    G = max_dev / std

    # Critical value
    t_crit = stats.t.ppf(1 - alpha / (2 * n), n - 2)
    G_crit = ((n - 1) / np.sqrt(n)) * np.sqrt(t_crit**2 / (n - 2 + t_crit**2))

    is_outlier = G > G_crit

    return is_outlier, max_idx, G, G_crit

# Example
is_outlier, outlier_idx, G_stat, G_crit = grubbs_test(data)

if is_outlier:
    print(f"Outlier detected at index {outlier_idx}: value = {data[outlier_idx]:.2f}")
    print(f"G statistic: {G_stat:.4f} > G critical: {G_crit:.4f}")
else:
    print("No outlier detected")
```

---

_Continue in next section..._
