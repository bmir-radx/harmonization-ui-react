import React from 'react';
import { MappingsLayout } from './harmonization/layout/MappingsLayout';
import { useHarmonizationState } from './harmonization/useHarmonizationState';

export function DataHarmonizationMappings() {
  const { state, actions } = useHarmonizationState();

  return (
    <MappingsLayout 
      state={state}
      actions={actions}
    />
  );
}