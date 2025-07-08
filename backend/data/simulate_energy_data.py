import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def simulate_data(num_racks=100, days=7, interval_minutes=15):
    # Starting timestamp: 7 days ago from now
    start_time = datetime.now() - timedelta(days=days)

    # Time intervals at 15-minute granularity
    timestamps = pd.date_range(start=start_time, periods=(days * 24 * 60) // interval_minutes, freq=f'{interval_minutes}min')

    all_data = []

    for rack_id in range(1, num_racks + 1):
        # Each rack has a slightly different base energy & temperature pattern
        base_energy = np.random.uniform(200, 400)
        base_temp = np.random.uniform(25, 35)

        # Simulate energy usage and corresponding temperature with noise
        energy = base_energy + np.random.normal(0, 30, len(timestamps))
        temperature = base_temp + (energy - base_energy) * 0.03 + np.random.normal(0, 1.5, len(timestamps))

        df = pd.DataFrame({
            'timestamp': timestamps,
            'rack_id': f"rack_{rack_id}",
            'energy_watts': np.clip(energy, 150, 600),
            'temperature_c': np.clip(temperature, 20, 50)
        })

        all_data.append(df)

    # Combine all rack data
    full_df = pd.concat(all_data)

    # Save the file
    os.makedirs('data', exist_ok=True)
    full_df.to_csv('data/simulated_rack_data.csv', index=False)
    print("✅ Simulated data for 100 racks saved to 'data/simulated_rack_data.csv'")

if __name__ == "__main__":
    simulate_data()
