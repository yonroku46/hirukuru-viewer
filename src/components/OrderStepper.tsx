"use client";

import { orderStatusDict } from '@/common/utils/StringUtils';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';

interface OrderStepperProps {
  minimal?: boolean;
  currentStatus: OrderState['status'];
}

export default function OrderStepper({ minimal = false, currentStatus }: OrderStepperProps) {

  const stepperList: OrderStatus['status'][] = ['BOOKED', 'PICKUP', 'DONE'];

  if (minimal || currentStatus === 'PENDING' || currentStatus === 'CANCEL') {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: orderStatusDict(currentStatus, 'color') as string,
        color: 'var(--background)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
      }}>
        {orderStatusDict(currentStatus, 'icon')}
      </Box>
    );
  }

  return (
    <Stepper activeStep={stepperList.indexOf(currentStatus)} alternativeLabel>
      {stepperList.map((status) => (
        <Step key={status}>
          <StepLabel>
            {orderStatusDict(status as OrderStatus['status'], 'icon')}
            {orderStatusDict(status as OrderStatus['status'], 'label')}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};