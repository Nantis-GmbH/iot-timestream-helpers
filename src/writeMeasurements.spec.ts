import { measurementToTimestreamRecords } from './writeMeasurements'

describe('write measurements', () => {
	test('should encode a device measurement to a timestream record', async () => {
		const timestreamRecords = measurementToTimestreamRecords({
			app: 'app',
			stage: 'stage',
			domain: 'domain',
			tenantId: 'tenant',
			deviceId: '123',
			time: '1613662580579',
			measurements: {
				temperature: 123,
				volume: 10,
				state: 'good',
			},
		})

		expect(timestreamRecords).toHaveLength(3)

		expect(timestreamRecords).toEqual([
			{
				Dimensions: [
					{ Name: 'app', Value: 'app' },
					{
						Name: 'stage',
						Value: 'stage',
					},
					{ Name: 'domain', Value: 'domain' },
					{ Name: 'tenantId', Value: 'tenant' },
					{
						Name: 'deviceId',
						Value: '123',
					},
				],
				MeasureName: 'temperature',
				MeasureValueType: 'DOUBLE',
				MeasureValue: '123',
				Time: '1613662580579',
			},
			{
				Dimensions: [
					{ Name: 'app', Value: 'app' },
					{ Name: 'stage', Value: 'stage' },
					{
						Name: 'domain',
						Value: 'domain',
					},
					{ Name: 'tenantId', Value: 'tenant' },
					{ Name: 'deviceId', Value: '123' },
				],
				MeasureName: 'volume',
				MeasureValueType: 'DOUBLE',
				MeasureValue: '10',
				Time: '1613662580579',
			},
			{
				Dimensions: [
					{ Name: 'app', Value: 'app' },
					{ Name: 'stage', Value: 'stage' },
					{
						Name: 'domain',
						Value: 'domain',
					},
					{ Name: 'tenantId', Value: 'tenant' },
					{ Name: 'deviceId', Value: '123' },
				],
				MeasureName: 'state',
				MeasureValueType: 'VARCHAR',
				MeasureValue: 'good',
				Time: '1613662580579',
			},
		])
	})
})
