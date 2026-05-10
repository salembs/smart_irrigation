#ifndef ESP32_UART_H
#define ESP32_UART_H

#include "stm32l0xx_hal.h"
#include <stdbool.h>

/* ── Pin definitions ───────────────────────────────────────────────────── */
#define ESP32_UART                  USART1
#define ESP32_UART_CLK_ENABLE()     __HAL_RCC_USART1_CLK_ENABLE()
#define ESP32_UART_IRQn             USART1_IRQn

#define ESP32_TX_PIN                GPIO_PIN_9
#define ESP32_TX_PORT               GPIOA
#define ESP32_TX_AF                 GPIO_AF4_USART1

#define ESP32_RX_PIN                GPIO_PIN_10
#define ESP32_RX_PORT               GPIOA
#define ESP32_RX_AF                 GPIO_AF4_USART1

#define ESP32_GPIO_CLK_ENABLE()     __HAL_RCC_GPIOA_CLK_ENABLE()
#define ESP32_BAUDRATE              115200

/* ── Buffer sizes ──────────────────────────────────────────────────────── */
#define ESP32_RING_BUFFER_SIZE      256U
#define ESP32_CMD_MAX_LEN           128U

/* ── Public API ────────────────────────────────────────────────────────── */
extern UART_HandleTypeDef hEsp32Uart;

void              ESP32_UART_Init(void);
HAL_StatusTypeDef ESP32_UART_Send(const uint8_t *pData, uint16_t size);
HAL_StatusTypeDef ESP32_UART_SendString(const char *str);
void              ESP32_UART_RxCallback(void);
bool              ESP32_UART_GetCommand(char *cmd, uint16_t maxLen);

#endif /* ESP32_UART_H */
