# Anomaly Detection - Part 2: Advanced Methods

_Continued from [Part 1: Basics and Statistical Methods](./ANOMALY_DETECTION.md)_

## Machine Learning Methods

### 1. Isolation Forest

**Concept**: Isolates anomalies by randomly selecting features and split values. Anomalies are easier to isolate (require fewer splits).

**How it Works**:

1. Randomly select a feature
2. Randomly select a split value between min and max
3. Repeat until point is isolated
4. Anomalies have shorter average path length

```python
from sklearn.ensemble import IsolationForest
import numpy as np
import matplotlib.pyplot as plt

# Generate data
np.random.seed(42)
X_normal = np.random.normal(0, 1, (1000, 2))
X_anomalies = np.random.uniform(-4, 4, (50, 2))
X = np.vstack([X_normal, X_anomalies])
y_true = np.array([0]*1000 + [1]*50)

# Train Isolation Forest
iso_forest = IsolationForest(
    contamination=0.05,  # Expected proportion of outliers
    n_estimators=100,
    max_samples='auto',
    random_state=42
)

# Fit and predict
y_pred = iso_forest.fit_predict(X)  # -1 for anomalies, 1 for normal
y_pred_binary = (y_pred == -1).astype(int)

# Get anomaly scores
anomaly_scores = -iso_forest.score_samples(X)  # More positive = more anomalous

# Visualize
fig, axes = plt.subplots(1, 2, figsize=(15, 6))

# Plot 1: Predictions
ax1 = axes[0]
scatter1 = ax1.scatter(X[:, 0], X[:, 1], c=y_pred_binary, cmap='RdYlGn_r', alpha=0.6)
ax1.set_xlabel('Feature 1')
ax1.set_ylabel('Feature 2')
ax1.set_title('Isolation Forest - Predictions')
plt.colorbar(scatter1, ax=ax1, label='Prediction (0=Normal, 1=Anomaly)')

# Plot 2: Anomaly scores
ax2 = axes[1]
scatter2 = ax2.scatter(X[:, 0], X[:, 1], c=anomaly_scores, cmap='RdYlGn_r', alpha=0.6)
ax2.set_xlabel('Feature 1')
ax2.set_ylabel('Feature 2')
ax2.set_title('Isolation Forest - Anomaly Scores')
plt.colorbar(scatter2, ax=ax2, label='Anomaly Score')

plt.tight_layout()
plt.savefig('/tmp/isolation_forest.png', dpi=300)

# Metrics
from sklearn.metrics import classification_report, roc_auc_score
print("=== Isolation Forest Results ===")
print(classification_report(y_true, y_pred_binary, target_names=['Normal', 'Anomaly']))
print(f"AUC-ROC: {roc_auc_score(y_true, anomaly_scores):.4f}")
```

**Parameters Explained**:

- `contamination`: Expected % of anomalies (helps set threshold)
- `n_estimators`: Number of trees (more = more stable but slower)
- `max_samples`: Samples per tree ('auto' = min(256, n_samples))

**Pros**:

- ✅ Works well with high-dimensional data
- ✅ Fast training and prediction
- ✅ No assumption about data distribution
- ✅ Handles contaminated training data

**Cons**:

- ❌ May struggle with local outliers in dense clusters
- ❌ Requires setting contamination parameter

### 2. One-Class SVM

**Concept**: Learns a boundary around normal data. Points outside boundary are anomalies.

```python
from sklearn.svm import OneClassSVM

# Train One-Class SVM
svm = OneClassSVM(
    kernel='rbf',  # Radial basis function kernel
    gamma='auto',  # Kernel coefficient
    nu=0.05  # Upper bound on fraction of outliers (similar to contamination)
)

# Fit and predict
y_pred_svm = svm.fit_predict(X)
y_pred_svm_binary = (y_pred_svm == -1).astype(int)

# Get decision function scores (distance from boundary)
decision_scores = -svm.decision_function(X)  # More positive = more anomalous

# Visualize decision boundary
xx, yy = np.meshgrid(np.linspace(-5, 5, 200), np.linspace(-5, 5, 200))
Z = svm.decision_function(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.figure(figsize=(10, 8))
plt.contourf(xx, yy, Z, levels=20, cmap='RdYlGn', alpha=0.4)
plt.contour(xx, yy, Z, levels=[0], linewidths=2, colors='red')  # Decision boundary
plt.scatter(X[:, 0], X[:, 1], c=y_pred_svm_binary, cmap='RdYlGn_r', edgecolors='black', alpha=0.7)
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('One-Class SVM - Decision Boundary')
plt.colorbar(label='Prediction (0=Normal, 1=Anomaly)')
plt.savefig('/tmp/one_class_svm.png', dpi=300)

print("\n=== One-Class SVM Results ===")
print(classification_report(y_true, y_pred_svm_binary, target_names=['Normal', 'Anomaly']))
print(f"AUC-ROC: {roc_auc_score(y_true, decision_scores):.4f}")
```

**Parameters**:

- `kernel`: Type of kernel ('rbf', 'linear', 'poly', 'sigmoid')
- `gamma`: Kernel coefficient (higher = tighter boundary)
- `nu`: Upper bound on % of outliers and lower bound on % of support vectors

**Pros**:

- ✅ Good for high-dimensional data
- ✅ Flexible with different kernels
- ✅ Provides decision boundary

**Cons**:

- ❌ Computationally expensive for large datasets
- ❌ Sensitive to kernel and parameter choices

### 3. DBSCAN (Density-Based Clustering)

**Concept**: Clusters based on density. Points in low-density regions are anomalies.

```python
from sklearn.cluster import DBSCAN

# Train DBSCAN
dbscan = DBSCAN(
    eps=0.5,  # Maximum distance between two samples to be in same neighborhood
    min_samples=5  # Minimum samples in neighborhood for core point
)

# Fit and predict
labels = dbscan.fit_predict(X)

# -1 indicates noise (anomalies)
y_pred_dbscan = (labels == -1).astype(int)

# Visualize clusters
plt.figure(figsize=(10, 8))
scatter = plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis', alpha=0.6)
plt.scatter(X[labels == -1, 0], X[labels == -1, 1],
           c='red', marker='x', s=100, linewidths=2, label='Anomalies')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('DBSCAN - Clusters and Anomalies')
plt.legend()
plt.colorbar(scatter, label='Cluster ID')
plt.savefig('/tmp/dbscan.png', dpi=300)

print("\n=== DBSCAN Results ===")
print(f"Number of clusters: {len(set(labels)) - (1 if -1 in labels else 0)}")
print(f"Number of noise points (anomalies): {(labels == -1).sum()}")
print(classification_report(y_true, y_pred_dbscan, target_names=['Normal', 'Anomaly']))
```

**Parameters**:

- `eps`: Neighborhood radius
- `min_samples`: Minimum points in neighborhood

**Pros**:

- ✅ No need to specify number of clusters
- ✅ Can find clusters of arbitrary shape
- ✅ Robust to outliers

**Cons**:

- ❌ Sensitive to eps and min_samples
- ❌ Struggles with varying densities

---

## Deep Learning Methods

### 1. Variational Autoencoder (VAE)

**Concept**: Probabilistic version of autoencoder. Learns distribution of normal data.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(VAE, self).__init__()

        # Encoder
        self.fc1 = nn.Linear(input_dim, 128)
        self.fc_mu = nn.Linear(128, latent_dim)  # Mean of latent distribution
        self.fc_logvar = nn.Linear(128, latent_dim)  # Log variance

        # Decoder
        self.fc3 = nn.Linear(latent_dim, 128)
        self.fc4 = nn.Linear(128, input_dim)

    def encode(self, x):
        """Encode input to latent distribution parameters"""
        h = F.relu(self.fc1(x))
        mu = self.fc_mu(h)
        logvar = self.fc_logvar(h)
        return mu, logvar

    def reparameterize(self, mu, logvar):
        """
        Reparameterization trick: z = mu + sigma * epsilon
        where epsilon ~ N(0,1)
        """
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z):
        """Decode from latent space to reconstruction"""
        h = F.relu(self.fc3(z))
        return self.fc4(h)

    def forward(self, x):
        """Forward pass"""
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        return self.decode(z), mu, logvar

def vae_loss(reconstructed, original, mu, logvar):
    """
    VAE loss = Reconstruction loss + KL divergence

    KL divergence measures how different the learned distribution
    is from the standard normal distribution
    """
    # Reconstruction loss (MSE)
    recon_loss = F.mse_loss(reconstructed, original, reduction='sum')

    # KL divergence
    # KL(N(mu, sigma) || N(0, 1))
    kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())

    return recon_loss + kl_loss

# Generate training data
np.random.seed(42)
train_data = np.random.normal(0, 1, (1000, 10))
test_normal = np.random.normal(0, 1, (900, 10))
test_anomalies = np.random.normal(3, 2, (100, 10))  # Different distribution

X_train = torch.FloatTensor(train_data)
X_test = torch.FloatTensor(np.vstack([test_normal, test_anomalies]))
y_test = np.array([0]*900 + [1]*100)

# Initialize VAE
vae = VAE(input_dim=10, latent_dim=2)
optimizer = torch.optim.Adam(vae.parameters(), lr=0.001)

# Training
print("Training VAE...")
num_epochs = 50

for epoch in range(num_epochs):
    vae.train()

    reconstructed, mu, logvar = vae(X_train)
    loss = vae_loss(reconstructed, X_train, mu, logvar)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.2f}")

# Inference
print("\nDetecting anomalies with VAE...")
vae.eval()

with torch.no_grad():
    reconstructed, mu, logvar = vae(X_test)

    # Anomaly score: reconstruction error + KL divergence
    recon_errors = torch.mean((X_test - reconstructed) ** 2, dim=1).numpy()

# Set threshold
with torch.no_grad():
    train_recon, train_mu, train_logvar = vae(X_train)
    train_errors = torch.mean((X_train - train_recon) ** 2, dim=1).numpy()
    threshold = np.percentile(train_errors, 95)

predictions = (recon_errors > threshold).astype(int)

print("\n=== VAE Results ===")
print(classification_report(y_test, predictions, target_names=['Normal', 'Anomaly']))
```

**Advantages of VAE over Standard Autoencoder**:

- ✅ Learns probabilistic representation
- ✅ Better generalization
- ✅ More robust to noise
- ✅ Can generate new samples

### 2. Generative Adversarial Network (GAN) for Anomaly Detection

**Concept**: Train GAN on normal data. Anomalies have poor reconstruction or low discriminator score.

```python
class Generator(nn.Module):
    def __init__(self, latent_dim, output_dim):
        super(Generator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, output_dim),
            nn.Tanh()
        )

    def forward(self, z):
        return self.model(z)

class Discriminator(nn.Module):
    def __init__(self, input_dim):
        super(Discriminator, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.3),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.model(x)

# Initialize GAN
latent_dim = 10
data_dim = 10

generator = Generator(latent_dim, data_dim)
discriminator = Discriminator(data_dim)

g_optimizer = torch.optim.Adam(generator.parameters(), lr=0.0002)
d_optimizer = torch.optim.Adam(discriminator.parameters(), lr=0.0002)
criterion = nn.BCELoss()

# Training
print("Training GAN...")
num_epochs = 50
batch_size = 32

for epoch in range(num_epochs):
    for i in range(0, len(X_train), batch_size):
        batch = X_train[i:i+batch_size]
        batch_size_actual = batch.size(0)

        # ============ Train Discriminator ============
        # Real data
        real_labels = torch.ones(batch_size_actual, 1)
        fake_labels = torch.zeros(batch_size_actual, 1)

        # Forward pass with real data
        real_output = discriminator(batch)
        d_loss_real = criterion(real_output, real_labels)

        # Forward pass with fake data
        z = torch.randn(batch_size_actual, latent_dim)
        fake_data = generator(z)
        fake_output = discriminator(fake_data.detach())
        d_loss_fake = criterion(fake_output, fake_labels)

        # Backward pass
        d_loss = d_loss_real + d_loss_fake
        d_optimizer.zero_grad()
        d_loss.backward()
        d_optimizer.step()

        # ============ Train Generator ============
        z = torch.randn(batch_size_actual, latent_dim)
        fake_data = generator(z)
        fake_output = discriminator(fake_data)

        # Generator wants discriminator to think fake data is real
        g_loss = criterion(fake_output, real_labels)

        g_optimizer.zero_grad()
        g_loss.backward()
        g_optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], D Loss: {d_loss.item():.4f}, G Loss: {g_loss.item():.4f}")

# Anomaly detection using discriminator scores
print("\nDetecting anomalies with GAN...")
discriminator.eval()

with torch.no_grad():
    # Discriminator score: probability that data is real
    # Lower score = more likely to be anomaly
    scores = discriminator(X_test).squeeze().numpy()

# Set threshold (e.g., 10th percentile of training scores)
with torch.no_grad():
    train_scores = discriminator(X_train).squeeze().numpy()
    threshold = np.percentile(train_scores, 10)

predictions = (scores < threshold).astype(int)

print("\n=== GAN Results ===")
print(classification_report(y_test, predictions, target_names=['Normal', 'Anomaly']))
```

---

## Time-Series Anomaly Detection

### 1. ARIMA-based Anomaly Detection

**Concept**: Fit ARIMA model to normal time series. Forecast future values. Large prediction errors indicate anomalies.

```python
from statsmodels.tsa.arima.model import ARIMA
import pandas as pd

# Generate time series with anomalies
np.random.seed(42)
time = np.arange(200)
normal_series = 10 + 2 * np.sin(time / 10) + np.random.normal(0, 0.5, 200)

# Add anomalies at specific points
anomaly_indices = [50, 100, 150]
normal_series[anomaly_indices] += np.array([5, -5, 7])

# Create dataframe
df = pd.DataFrame({
    'time': time,
    'value': normal_series
})

# Fit ARIMA model (on first 100 points without anomalies)
train_data = df['value'][:40].values

model = ARIMA(train_data, order=(2, 0, 2))  # (p, d, q)
fitted_model = model.fit()

# Forecast and detect anomalies
predictions = []
residuals = []
threshold_multiplier = 3

for i in range(40, len(df)):
    # Forecast next value
    forecast = fitted_model.forecast(steps=1)[0]
    predictions.append(forecast)

    # Calculate residual (prediction error)
    actual = df['value'].iloc[i]
    residual = abs(actual - forecast)
    residuals.append(residual)

    # Update model with new observation (rolling forecast)
    # Re-fit with last 40 points
    window_data = df['value'].iloc[max(0, i-39):i+1].values
    model = ARIMA(window_data, order=(2, 0, 2))
    fitted_model = model.fit()

# Determine threshold based on residuals
residuals = np.array(residuals)
threshold = np.mean(residuals) + threshold_multiplier * np.std(residuals)

anomalies = residuals > threshold

# Visualize
plt.figure(figsize=(15, 6))

plt.subplot(2, 1, 1)
plt.plot(df['time'], df['value'], label='Actual', alpha=0.7)
plt.plot(df['time'][40:], predictions, label='ARIMA Forecast', alpha=0.7)
plt.scatter(df['time'][40:][anomalies], df['value'][40:][anomalies],
           color='red', s=100, label='Detected Anomalies', zorder=5)
plt.xlabel('Time')
plt.ylabel('Value')
plt.title('ARIMA-based Anomaly Detection')
plt.legend()
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(df['time'][40:], residuals, label='Prediction Error')
plt.axhline(y=threshold, color='red', linestyle='--', label='Threshold')
plt.fill_between(df['time'][40:], 0, threshold, alpha=0.2, color='green')
plt.fill_between(df['time'][40:], threshold, residuals.max(), alpha=0.2, color='red')
plt.xlabel('Time')
plt.ylabel('Prediction Error')
plt.title('Prediction Errors (Residuals)')
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('/tmp/arima_anomaly_detection.png', dpi=300)

print(f"Detected {anomalies.sum()} anomalies in time series")
```

### 2. Prophet for Anomaly Detection

```python
# Note: Requires fbprophet library
# pip install fbprophet

from fbprophet import Prophet

# Prepare data for Prophet
df_prophet = pd.DataFrame({
    'ds': pd.date_range(start='2023-01-01', periods=len(df), freq='D'),
    'y': df['value']
})

# Fit Prophet model on training data
train_df = df_prophet[:40]
model = Prophet(
    yearly_seasonality=False,
    weekly_seasonality=False,
    daily_seasonality=False,
    changepoint_prior_scale=0.05
)
model.fit(train_df)

# Make predictions
future = df_prophet[['ds']]
forecast = model.predict(future)

# Calculate prediction intervals
forecast['residual'] = df_prophet['y'] - forecast['yhat']
forecast['abs_residual'] = abs(forecast['residual'])

# Anomalies are points outside prediction intervals
forecast['anomaly'] = (
    (df_prophet['y'] < forecast['yhat_lower']) |
    (df_prophet['y'] > forecast['yhat_upper'])
)

print(f"Prophet detected {forecast['anomaly'].sum()} anomalies")
```

### 3. Seasonal Hybrid ESD (S-H-ESD) for Twitter's AnomalyDetection

**Concept**: Decomposes time series into trend, seasonal, and residual components. Detects anomalies in residuals.

```python
from statsmodels.tsa.seasonal import seasonal_decompose

# Decompose time series
decomposition = seasonal_decompose(
    df['value'],
    model='additive',
    period=20  # Seasonality period
)

# Extract components
trend = decomposition.trend
seasonal = decomposition.seasonal
residual = decomposition.resid

# Detect anomalies in residuals using ESD test
def esd_test(data, max_outliers=10, alpha=0.05):
    """
    Generalized ESD (Extreme Studentized Deviate) test
    """
    from scipy import stats

    data = data.dropna().values
    outliers = []

    for i in range(max_outliers):
        if len(data) < 3:
            break

        # Calculate test statistic
        mean = np.mean(data)
        std = np.std(data, ddof=1)

        # Find point with maximum deviation
        abs_dev = np.abs(data - mean)
        max_idx = np.argmax(abs_dev)
        max_dev = abs_dev[max_idx]

        G = max_dev / std

        # Critical value
        n = len(data)
        p = 1 - alpha / (2 * (n - i))
        t_crit = stats.t.ppf(p, n - i - 2)
        lambda_crit = (n - i - 1) * t_crit / np.sqrt((n - i - 2 + t_crit**2) * (n - i))

        if G > lambda_crit:
            outliers.append(max_idx)
            data = np.delete(data, max_idx)
        else:
            break

    return outliers

outlier_indices = esd_test(residual, max_outliers=10)
print(f"S-H-ESD detected {len(outlier_indices)} anomalies")
```

---

## Real-World Example: Network Traffic Anomaly Detection

```python
# Complete end-to-end example
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt

# Simulate network traffic data
np.random.seed(42)
n_samples = 10000

# Normal traffic features
normal_traffic = pd.DataFrame({
    'bytes_sent': np.random.gamma(2, 1000, n_samples),
    'bytes_received': np.random.gamma(2, 800, n_samples),
    'packets_sent': np.random.poisson(50, n_samples),
    'packets_received': np.random.poisson(45, n_samples),
    'connection_duration': np.random.exponential(30, n_samples),
    'unique_ips': np.random.poisson(5, n_samples)
})

# Add anomalies (DDoS attack, data exfiltration, port scanning)
n_anomalies = 500

# DDoS: High packets, low bytes
dd os_traffic = pd.DataFrame({
    'bytes_sent': np.random.gamma(1, 500, n_anomalies // 3),
    'bytes_received': np.random.gamma(1, 400, n_anomalies // 3),
    'packets_sent': np.random.poisson(500, n_anomalies // 3),
    'packets_received': np.random.poisson(480, n_anomalies // 3),
    'connection_duration': np.random.exponential(5, n_anomalies // 3),
    'unique_ips': np.random.poisson(100, n_anomalies // 3)
})

# Data exfiltration: Very high bytes sent
exfil_traffic = pd.DataFrame({
    'bytes_sent': np.random.gamma(5, 5000, n_anomalies // 3),
    'bytes_received': np.random.gamma(2, 800, n_anomalies // 3),
    'packets_sent': np.random.poisson(200, n_anomalies // 3),
    'packets_received': np.random.poisson(45, n_anomalies // 3),
    'connection_duration': np.random.exponential(60, n_anomalies // 3),
    'unique_ips': np.random.poisson(5, n_anomalies // 3)
})

# Port scanning: Many connections, short duration
scan_traffic = pd.DataFrame({
    'bytes_sent': np.random.gamma(1, 200, n_anomalies // 3),
    'bytes_received': np.random.gamma(1, 150, n_anomalies // 3),
    'packets_sent': np.random.poisson(10, n_anomalies // 3),
    'packets_received': np.random.poisson(8, n_anomalies // 3),
    'connection_duration': np.random.exponential(1, n_anomalies // 3),
    'unique_ips': np.random.poisson(200, n_anomalies // 3)
})

# Combine all data
all_traffic = pd.concat([normal_traffic, ddos_traffic, exfil_traffic, scan_traffic],
                        ignore_index=True)
labels = np.array([0]*n_samples + [1]*n_anomalies)

# Feature engineering
all_traffic['bytes_ratio'] = all_traffic['bytes_sent'] / (all_traffic['bytes_received'] + 1)
all_traffic['packets_ratio'] = all_traffic['packets_sent'] / (all_traffic['packets_received'] + 1)
all_traffic['bytes_per_packet_sent'] = all_traffic['bytes_sent'] / (all_traffic['packets_sent'] + 1)
all_traffic['connections_per_ip'] = all_traffic['packets_sent'] / (all_traffic['unique_ips'] + 1)

# Normalize features
scaler = StandardScaler()
X = scaler.fit_transform(all_traffic)

# Train Isolation Forest
model = IsolationForest(
    contamination=0.05,
    n_estimators=100,
    random_state=42
)

predictions = model.fit_predict(X)
predictions_binary = (predictions == -1).astype(int)
anomaly_scores = -model.score_samples(X)

# Evaluate
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

print("=== Network Traffic Anomaly Detection Results ===")
print("\nClassification Report:")
print(classification_report(labels, predictions_binary,
                           target_names=['Normal', 'Anomaly']))

print(f"\nAUC-ROC Score: {roc_auc_score(labels, anomaly_scores):.4f}")

# Confusion Matrix
cm = confusion_matrix(labels, predictions_binary)
plt.figure(figsize=(8, 6))
plt.imshow(cm, interpolation='nearest', cmap='Blues')
plt.title('Confusion Matrix - Network Traffic Anomaly Detection')
plt.colorbar()
tick_marks = np.arange(2)
plt.xticks(tick_marks, ['Normal', 'Anomaly'])
plt.yticks(tick_marks, ['Normal', 'Anomaly'])

# Add text annotations
thresh = cm.max() / 2
for i, j in np.ndindex(cm.shape):
    plt.text(j, i, format(cm[i, j], 'd'),
            ha="center", va="center",
            color="white" if cm[i, j] > thresh else "black")

plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.tight_layout()
plt.savefig('/tmp/network_traffic_confusion_matrix.png', dpi=300)

print("\n✅ Network traffic anomaly detection complete!")
```

---

## Best Practices

### 1. Choosing the Right Method

```python
def choose_anomaly_detection_method(data_characteristics):
    """
    Decision guide for selecting anomaly detection method
    """

    recommendations = []

    # Data size
    if data_characteristics['n_samples'] < 1000:
        recommendations.append("Small dataset: Statistical methods (Z-score, IQR)")
    elif data_characteristics['n_samples'] < 100000:
        recommendations.append("Medium dataset: Isolation Forest, One-Class SVM")
    else:
        recommendations.append("Large dataset: Isolation Forest, Mini-batch methods")

    # Data distribution
    if data_characteristics['distribution'] == 'gaussian':
        recommendations.append("Gaussian: Z-score, Mahalanobis distance")
    elif data_characteristics['distribution'] == 'multi-modal':
        recommendations.append("Multi-modal: LOF, DBSCAN, GMM")
    else:
        recommendations.append("Unknown distribution: Isolation Forest (distribution-free)")

    # Dimensionality
    if data_characteristics['n_features'] > 50:
        recommendations.append("High-dimensional: Isolation Forest, Autoencoders")
    else:
        recommendations.append("Low-dimensional: Any method works")

    # Time series
    if data_characteristics['is_time_series']:
        recommendations.append("Time series: ARIMA, Prophet, LSTM Autoencoder")

    # Labeled data
    if data_characteristics['has_labels']:
        recommendations.append("Supervised: Random Forest, XGBoost, Neural Networks")
    else:
        recommendations.append("Unsupervised: Isolation Forest, LOF, Autoencoders")

    return recommendations

# Example usage
data_chars = {
    'n_samples': 50000,
    'n_features': 20,
    'distribution': 'multi-modal',
    'is_time_series': False,
    'has_labels': False
}

recommendations = choose_anomaly_detection_method(data_chars)
print("Recommended methods:")
for rec in recommendations:
    print(f"  - {rec}")
```

### 2. Evaluation Metrics

```python
def evaluate_anomaly_detection(y_true, y_pred, scores):
    """
    Comprehensive evaluation of anomaly detection
    """
    from sklearn.metrics import (
        precision_score, recall_score, f1_score,
        roc_auc_score, average_precision_score,
        confusion_matrix
    )

    metrics = {}

    # Basic metrics
    metrics['precision'] = precision_score(y_true, y_pred)
    metrics['recall'] = recall_score(y_true, y_pred)
    metrics['f1_score'] = f1_score(y_true, y_pred)

    # Threshold-independent metrics
    metrics['auc_roc'] = roc_auc_score(y_true, scores)
    metrics['auc_pr'] = average_precision_score(y_true, scores)

    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    metrics['true_negative_rate'] = tn / (tn + fp) if (tn + fp) > 0 else 0
    metrics['false_positive_rate'] = fp / (fp + tn) if (fp + tn) > 0 else 0

    return metrics

# Example
metrics = evaluate_anomaly_detection(labels, predictions_binary, anomaly_scores)

print("\n=== Detailed Metrics ===")
for metric, value in metrics.items():
    print(f"{metric}: {value:.4f}")
```

### 3. Handling Imbalanced Data

```python
# Technique 1: Adjust contamination parameter
iso_forest_balanced = IsolationForest(
    contamination=0.01,  # Set to expected anomaly rate
    n_estimators=100
)

# Technique 2: Use stratified sampling for evaluation
from sklearn.model_selection import StratifiedKFold

skf = StratifiedKFold(n_splits=5)
for train_idx, test_idx in skf.split(X, labels):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = labels[train_idx], labels[test_idx]

    # Train and evaluate
    model.fit(X_train)
    predictions = model.predict(X_test)
    # Evaluate...

# Technique 3: Use appropriate metrics (precision-recall over accuracy)
from sklearn.metrics import precision_recall_curve

precision, recall, thresholds = precision_recall_curve(y_true, scores)

# Find optimal threshold (F1 score)
f1_scores = 2 * (precision * recall) / (precision + recall + 1e-10)
optimal_idx = np.argmax(f1_scores)
optimal_threshold = thresholds[optimal_idx]

print(f"Optimal threshold: {optimal_threshold:.4f}")
print(f"Best F1 score: {f1_scores[optimal_idx]:.4f}")
```

---

## Summary

| Method               | Type          | Pros                     | Cons                      | Best For                    |
| -------------------- | ------------- | ------------------------ | ------------------------- | --------------------------- |
| **Z-Score**          | Statistical   | Fast, simple             | Assumes Gaussian          | Single-peaked distributions |
| **IQR**              | Statistical   | Robust                   | Less sensitive            | Skewed distributions        |
| **Isolation Forest** | ML            | Fast, scalable           | Need to set contamination | General purpose, high-dim   |
| **One-Class SVM**    | ML            | Flexible                 | Slow for large data       | Complex boundaries          |
| **LOF**              | ML            | Finds local outliers     | O(n²) complexity          | Varying density             |
| **DBSCAN**           | Clustering    | No params for # clusters | Sensitive to params       | Density-based clusters      |
| **Autoencoder**      | Deep Learning | Handles complex patterns | Needs tuning              | High-dimensional, complex   |
| **VAE**              | Deep Learning | Probabilistic            | More complex              | When uncertainty matters    |
| **LSTM**             | Deep Learning | Time dependencies        | Needs много data          | Time series                 |

---

**Related Resources**:

- [Part 1: Basics and Statistical Methods](./ANOMALY_DETECTION.md)
- [MLOps Guide](./MLOPS_GUIDE.md)
- [Data Science Fundamentals](./DATA_SCIENCE_FUNDAMENTALS.md)

_Last Updated: 2026-02-19_
