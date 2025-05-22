import { GraphQLScalarType, Kind } from 'graphql';

const DateTimeScalar = new GraphQLScalarType({
    name: 'DateTime',
    description: 'Tipo escalar para fechas y horas',
    serialize(value) {
        return value instanceof Date ? value.toISOString() : null;
    },
    parseValue(value: any) {
        return value ? new Date(value) : null;
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
        }
        return null;
    }
});

export default DateTimeScalar;
