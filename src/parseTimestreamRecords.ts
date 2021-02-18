import { ColumnInfo, Datum, ScalarType } from '@aws-sdk/client-timestream-query'

type ScalarTypes = boolean | Date | number | BigInt | string | undefined

export const parseValue = (value: string, type: ScalarType): ScalarTypes => {
	switch (type) {
		case ScalarType.BIGINT:
			return BigInt(value)
		case ScalarType.BOOLEAN:
			return value === 'true'
		case ScalarType.DATE:
			// TODO check value
			return value
		case ScalarType.DOUBLE:
			return parseFloat(value)
		case ScalarType.INTEGER:
			return parseInt(value, 10)
		case ScalarType.TIME:
			// TODO check value
			return value
		case ScalarType.TIMESTAMP:
			return new Date(`${value.replace(' ', 'T')}Z`)
		// Fall through
		case ScalarType.INTERVAL_DAY_TO_SECOND:
		case ScalarType.INTERVAL_YEAR_TO_MONTH:
		case ScalarType.UNKNOWN:
		case ScalarType.VARCHAR:
		default:
			return value
	}
}

export const parseDatum = (
	datum: Datum,
	columnInfo: ColumnInfo,
): ScalarTypes | ScalarTypes[] => {
	if (datum.NullValue === true) return undefined
	if (datum.ScalarValue !== undefined)
		return parseValue(
			datum.ScalarValue,
			columnInfo.Type?.ScalarType as ScalarType,
		)
	if (datum.ArrayValue !== undefined) {
		return datum.ArrayValue.map((d: Datum) => {
			if (d.NullValue === true) return undefined
			return parseValue(
				d.ScalarValue as string,
				columnInfo.Type?.ArrayColumnInfo?.Type?.ScalarType as ScalarType,
			)
		})
	}
	throw new Error(`Unable to parse datum: ${JSON.stringify(datum)}`)
}
