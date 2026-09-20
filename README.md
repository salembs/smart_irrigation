# 🌱 IoT-Based Smart Irrigation System

A fully autonomous, solar-powered, and off-grid smart irrigation system designed for efficient agricultural water management using IoT technologies. This project combines embedded systems, long-range wireless communication, cloud integration, and real-time monitoring to automate irrigation and optimize water usage.

## 📸 System Architecture

```
![System Architecture](https://github.com/salembs/smart_irrigation/blob/f0ab51059305223acde13d7fb8a72383d4a717a5/architecture.jpg)

```

## 🔧 Key Features

* **Real-time Environmental Monitoring:** Tracks soil moisture, rainfall, and temperature using dedicated sensors.

* **Long-Range Wireless Communication:** Utilizes LoRa Point-to-Point (P2P) communication between field nodes and the gateway.

* **Intelligent Automation:** Automatically triggers irrigation based on live sensor thresholds.

* **Remote Control:** Provides a live web dashboard for manual irrigation overrides and monitoring.

* **Dual-MCU Gateway Architecture:** Combines STM32 and ESP32 chips for secure communication and reliable internet connectivity.

* **Fail-Safe Backup:** Features an onboard SD card module to prevent telemetry data loss during network outages.

* **Solar-Powered & Off-Grid:** Optimized low-energy architecture for continuous, standalone operation in remote areas.

* **Cloud Synchronization:** Real-time data logging and dashboard updates.

## 🔌 Hardware Components

* **Microcontrollers & Modules:**

  * STM32L072CZT6 (B-L072Z-LRWAN1 Discovery Board)

  * ESP32 NodeMCU

* **Sensors & Actuators:**

  * YL-69 Soil Moisture Sensor

  * YL-83 Rain Sensor

  * 5V Relay Module

  * Mini DC Water Pump

* **Power & Storage:**

  * 5V Battery

  * 15W Solar Panel

  * SD Card Module

* **Protection:**

  * 1N4007 Flyback Diode

## 💻 Technologies & Development Tools

* **Communication Protocols:** LoRa P2P, UART, SPI, Wi-Fi, HTTP

* **Embedded Development:** STM32CubeIDE, Arduino IDE, Tera Term

* **Cloud & Web Stack:** Supabase, React.js

## 📊 Project Outcomes

* ✅ **End-to-End Connectivity:** Successful communication pipeline from field sensors to the gateway, cloud database, and web dashboard.

* ✅ **Autonomous Operation:** Verified automatic irrigation behavior operating reliably without human intervention.

* ✅ **Long-Range Stability:** Consistent wireless link performance in remote, off-grid environments.

* ✅ **Data Resilience:** Reliable fail-safe telemetry recovery via SD card logging during network interruptions.

* ✅ **Resource Efficiency:** Minimized water waste through smart, threshold-based irrigation logic.

## 🚀 Getting Started

1. **Firmware:** Flash the STM32 and ESP32 code using `STM32CubeIDE` and `Arduino IDE`.

2. **Database:** Set up your tables in Supabase using the provided schema.

3. **Dashboard:** Run the React.js web application locally or deploy it to your preferred hosting platform.
