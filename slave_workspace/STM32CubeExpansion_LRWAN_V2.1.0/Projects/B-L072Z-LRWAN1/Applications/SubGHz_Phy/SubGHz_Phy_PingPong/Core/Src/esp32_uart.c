#include "esp32_uart.h"
#include "stm32_lpm.h"   /* I-CUBE-LRWAN low power manager */
#include <string.h>

/* --------------------------------------------------------
 * Private handle
 * -------------------------------------------------------- */
static UART_HandleTypeDef hEsp32Uart;

/* --------------------------------------------------------
 * Init
 * -------------------------------------------------------- */
void ESP32_UART_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    /* 1. Enable clocks */
    ESP32_GPIO_CLK_ENABLE();
    ESP32_UART_CLK_ENABLE();

    /* 2. Configure TX pin */
    GPIO_InitStruct.Pin       = ESP32_TX_PIN;
    GPIO_InitStruct.Mode      = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull      = GPIO_NOPULL;
    GPIO_InitStruct.Speed     = GPIO_SPEED_FREQ_HIGH;
    GPIO_InitStruct.Alternate = ESP32_TX_AF;
    HAL_GPIO_Init(ESP32_TX_PORT, &GPIO_InitStruct);

    /* 3. Configure RX pin */
    GPIO_InitStruct.Pin       = ESP32_RX_PIN;
    GPIO_InitStruct.Alternate = ESP32_RX_AF;
    HAL_GPIO_Init(ESP32_RX_PORT, &GPIO_InitStruct);

    /* 4. Configure UART peripheral */
    hEsp32Uart.Instance          = ESP32_UART;
    hEsp32Uart.Init.BaudRate     = ESP32_BAUDRATE;
    hEsp32Uart.Init.WordLength   = UART_WORDLENGTH_8B;
    hEsp32Uart.Init.StopBits     = UART_STOPBITS_1;
    hEsp32Uart.Init.Parity       = UART_PARITY_NONE;
    hEsp32Uart.Init.Mode         = UART_MODE_TX_RX;   /* TX + RX unlike the trace UART */
    hEsp32Uart.Init.HwFlowCtl    = UART_HWCONTROL_NONE;
    hEsp32Uart.Init.OverSampling = UART_OVERSAMPLING_16;

    if (HAL_UART_Init(&hEsp32Uart) != HAL_OK)
    {
        Error_Handler();
    }
}

/* --------------------------------------------------------
 * Send raw bytes
 * - Disables Stop mode while TX is active so the LoRa
 *   low-power manager does not power down the UART clock
 * -------------------------------------------------------- */
HAL_StatusTypeDef ESP32_UART_Send(const uint8_t *pData, uint16_t size)
{
    HAL_StatusTypeDef status;

    /* Prevent MCU from entering Stop mode during transmission */
    UTIL_LPM_SetStopMode((1 << CFG_LPM_APPLI_Id), UTIL_LPM_DISABLE);

    status = HAL_UART_Transmit(&hEsp32Uart, (uint8_t *)pData, size, 1000);

    /* Re-enable Stop mode */
    UTIL_LPM_SetStopMode((1 << CFG_LPM_APPLI_Id), UTIL_LPM_ENABLE);

    return status;
}

/* --------------------------------------------------------
 * Send a null-terminated string
 * -------------------------------------------------------- */
HAL_StatusTypeDef ESP32_UART_SendString(const char *str)
{
    return ESP32_UART_Send((const uint8_t *)str, (uint16_t)strlen(str));
}

/* --------------------------------------------------------
 * Blocking receive with timeout (milliseconds)
 * Returns number of bytes actually received
 * -------------------------------------------------------- */
uint16_t ESP32_UART_Receive(uint8_t *pData, uint16_t maxSize, uint32_t timeout)
{
    HAL_StatusTypeDef status;

    UTIL_LPM_SetStopMode((1 << CFG_LPM_APPLI_Id), UTIL_LPM_DISABLE);

    status = HAL_UART_Receive(&hEsp32Uart, pData, maxSize, timeout);

    UTIL_LPM_SetStopMode((1 << CFG_LPM_APPLI_Id), UTIL_LPM_ENABLE);

    /* HAL_OK  → maxSize bytes received
       HAL_TIMEOUT → partial data, check __HAL_UART_GET_FLAG for real count */
    if (status == HAL_OK)
        return maxSize;

    /* Return bytes received before timeout using the internal counter */
    return (uint16_t)(maxSize - hEsp32Uart.RxXferCount);
}