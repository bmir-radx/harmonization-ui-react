import { Parameters } from './types';

export const getExample = (primitive: string, params: Parameters): string => {
  switch (primitive) {
    case 'ConvertUnits':
      return `ConvertUnits(1000) → 1 params: {source: ${params.sourceUnit || 'meters'}, target: ${params.targetUnit || 'kilometers'}}`;
    case 'Truncate':
      const length = params.maxLength || 3;
      return `Truncate("94305-2005") → "${'943'.slice(0, length)}" params: {length: ${length}}`;
    case 'Cast':
      const sourceType = params.sourceType || 'string';
      const targetType = params.targetType || 'integer';
      let example = 'Cast("1") → 1';
      if (sourceType === 'string' && targetType === 'integer') {
        example = 'Cast("1") → 1';
      } else if (sourceType === 'integer' && targetType === 'string') {
        example = 'Cast(1) → "1"';
      } else if (sourceType === 'string' && targetType === 'bool') {
        example = 'Cast("true") → true';
      }
      return `${example} params: {source: ${sourceType}, target: ${targetType}}`;
    case 'EnumToEnum':
      const mappings = params.mappingTable || [];
      const mappingStr = mappings.length > 0 
        ? mappings.map(m => `${m.key} → ${m.value}`).join(', ')
        : '1 → 0, 2 → 1, 3 → 2';
      return `EnumToEnum(2) → 1 params: {mapping: ${mappingStr}}`;
    case 'Bin':
      const bins = params.binRows || [];
      const binStr = bins.length > 0
        ? bins.map(b => `[${b.lower}, ${b.upper}] → "${b.label}"`).join(', ')
        : '[MIN, 99] → "normal", [100, 125] → "prediabetes", [126, MAX] → "diabetes"';
      return `Bin(137) → "diabetes" params: {bins: ${binStr}}`;
    case 'Reduce':
      const operation = params.operation || 'any';
      return `Reduce([0, 0, 1, 0]) → True params: {operation: ${operation}}`;
    case 'ConvertDate':
      const sourceFormat = params.sourceFormat || '%m/%d/%Y';
      const targetFormat = params.targetFormat || '%Y-%m-%d';
      return `ConvertDate("03/14/2025") → "2025-03-14" params: {source: ${sourceFormat}, target: ${targetFormat}}`;
    case 'Round':
      const precision = params.precision || 2;
      return `Round(13.226) → 13.${'23'.slice(0, precision)} params: {precision: ${precision}}`;
    case 'Threshold':
      const lower = params.lowerBound || 0;
      const upper = params.upperBound || 10;
      return `Threshold(16) → ${upper} params: {lower: ${lower}, upper: ${upper}}`;
    default:
      return '';
  }
};

export const generateSyntheticData = (columnName: string, type: string, rowCount: number = 100): any[] => {
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    switch (type) {
      case 'string':
        if (columnName.includes('education')) {
          data.push(['High School', 'Bachelor', 'Master', 'PhD', 'Associate'][Math.floor(Math.random() * 5)]);
        } else if (columnName.includes('ethnicity')) {
          data.push(['Asian', 'Black', 'White', 'Hispanic', 'Other'][Math.floor(Math.random() * 5)]);
        } else if (columnName.includes('record') || columnName.includes('id')) {
          data.push(`REC${String(i + 1000).padStart(6, '0')}`);
        } else {
          data.push(`${columnName}_${i + 1}`);
        }
        break;
      case 'integer':
        if (columnName.includes('age')) {
          data.push(Math.floor(Math.random() * 60) + 18);
        } else if (columnName.includes('height')) {
          data.push(Math.floor(Math.random() * 50) + 150);
        } else if (columnName.includes('weight')) {
          data.push(Math.floor(Math.random() * 80) + 50);
        } else {
          data.push(Math.floor(Math.random() * 1000) + 1);
        }
        break;
      case 'boolean':
        data.push(Math.random() > 0.5);
        break;
      case 'date':
        const start = new Date(1980, 0, 1);
        const end = new Date(2024, 11, 31);
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        data.push(randomDate.toISOString().split('T')[0]);
        break;
      default:
        data.push(`value_${i + 1}`);
    }
  }
  return data;
};