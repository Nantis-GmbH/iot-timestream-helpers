import {
	_Record,
	Dimension,
	MeasureValueType,
} from '@aws-sdk/client-timestream-write'

// A set of measurements with common properties coming from the device
export type DeviceMeasurement = {
	app: string
	stage: string
	domain: string
	tenantId: string
	deviceId: string
	time: string
	measurements: Record<string, any>
}

export const measurementToTimestreamRecords = (
	deviceMeasurement: DeviceMeasurement,
): _Record[] => {
	const dimensions = dimensionsForDeviceMeasurement(deviceMeasurement)

	return Object.entries(deviceMeasurement.measurements)
		.map(([key, value]) => {
			return singleMeasurementToRecord(
				dimensions,
				key,
				value,
				deviceMeasurement.time,
			)
		})
		.filter((record: _Record) => record != null)
}

/**
 * Return a common dimension set for the deviceMeasurement
 * @param deviceMeasurement
 */
export const dimensionsForDeviceMeasurement = (
	deviceMeasurement: DeviceMeasurement,
): Dimension[] => {
	return [
		{ Name: 'app', Value: deviceMeasurement.app },
		{ Name: 'stage', Value: deviceMeasurement.stage },
		{ Name: 'domain', Value: deviceMeasurement.domain },
		{ Name: 'tenantId', Value: deviceMeasurement.tenantId },
		{ Name: 'deviceId', Value: deviceMeasurement.deviceId },
	]
}

/**
 * Deduce the MeasureValueType from a JavaScript type
 * https://docs.aws.amazon.com/timestream/latest/developerguide/API_Record.html
 * @param v A javascript data type
 */
const toTimestreamType = (v: unknown): MeasureValueType => {
	switch (typeof v) {
		case 'string':
			return MeasureValueType.VARCHAR
		case 'boolean':
			return MeasureValueType.BOOLEAN
		default:
			return MeasureValueType.DOUBLE
	}
}

/**
 * Create a timestream record from a measurement
 * @param dimensions The dimensions for the record
 * @param key A property key resulting in a MeasureName
 * @param value A value resulting in a MeasureValue
 * @param time The time string of the Measure
 */
export const singleMeasurementToRecord = (
	dimensions: Dimension[],
	key: string,
	value: boolean | number | string,
	time: string,
): _Record => {
	return {
		Dimensions: dimensions,
		MeasureName: key,
		MeasureValueType: toTimestreamType(value),
		MeasureValue: value.toString(),
		Time: time,
	}
}
