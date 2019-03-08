################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/GoogleIoT/Src/googleiot.c \
C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/GoogleIoT/Src/jwt.c 

OBJS += \
./Application/GoogleIoT/googleiot.o \
./Application/GoogleIoT/jwt.o 

C_DEPS += \
./Application/GoogleIoT/googleiot.d \
./Application/GoogleIoT/jwt.d 


# Each subdirectory must supply rules for building sources it contributes
Application/GoogleIoT/googleiot.o: C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/GoogleIoT/Src/googleiot.c
	@echo 'Building file: $<'
	@echo 'Invoking: MCU GCC Compiler'
	@echo $(PWD)
	arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16 -DSTM32L475xx -DUSE_HAL_DRIVER -DSENSOR '-DMBEDTLS_CONFIG_FILE=<googleiot_mbedtls_config.h>' '-DMQTTCLIENT_PLATFORM_HEADER=paho_mqtt_platform.h' -DENABLE_IOT_INFO -DENABLE_IOT_ERROR -DENABLE_IOT_WARNING -DGOOGLEIOT -DUSE_MBED_TLS -DUSE_WIFI -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/CMSIS/Device/ST/STM32L4xx/Include" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/STM32L4xx_HAL_Driver/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/B-L475E-IOT01" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/B-L475E-IOT01A/Applications/Cloud/GoogleIoT/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/GoogleIoT/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/Shared/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/paho.mqtt.embedded-c/MQTTClient-C/src" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/paho.mqtt.embedded-c/MQTTPacket/src" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/mbedTLS/include" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/cJSON" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/es_wifi" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/hts221" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/lis3mdl" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/lps22hb" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/lsm6dsl" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/vl53l0x" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/CMSIS/Include"  -Os -g3 -Wall -fmessage-length=0 -ffunction-sections -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '

Application/GoogleIoT/jwt.o: C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/GoogleIoT/Src/jwt.c
	@echo 'Building file: $<'
	@echo 'Invoking: MCU GCC Compiler'
	@echo $(PWD)
	arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16 -DSTM32L475xx -DUSE_HAL_DRIVER -DSENSOR '-DMBEDTLS_CONFIG_FILE=<googleiot_mbedtls_config.h>' '-DMQTTCLIENT_PLATFORM_HEADER=paho_mqtt_platform.h' -DENABLE_IOT_INFO -DENABLE_IOT_ERROR -DENABLE_IOT_WARNING -DGOOGLEIOT -DUSE_MBED_TLS -DUSE_WIFI -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/CMSIS/Device/ST/STM32L4xx/Include" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/STM32L4xx_HAL_Driver/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/B-L475E-IOT01" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/B-L475E-IOT01A/Applications/Cloud/GoogleIoT/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/GoogleIoT/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Projects/Common/Shared/Inc" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/paho.mqtt.embedded-c/MQTTClient-C/src" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/paho.mqtt.embedded-c/MQTTPacket/src" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/mbedTLS/include" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Middlewares/Third_Party/cJSON" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/es_wifi" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/hts221" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/lis3mdl" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/lps22hb" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/lsm6dsl" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/BSP/Components/vl53l0x" -I"C:/Users/William/Downloads/en.x-cube-gcp/STM32CubeExpansion_Cloud_GCP_V1.0.0/Drivers/CMSIS/Include"  -Os -g3 -Wall -fmessage-length=0 -ffunction-sections -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '

