import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

interface SubjectPerformanceChartProps {
  subjects: Array<{ name: string; correct: number; total: number }>;
}

const colors = ['#1976d2', '#388e3c', '#f57c00'];

export default function SubjectPerformanceChart({ subjects }: SubjectPerformanceChartProps) {
  return (
    <Box display="flex" alignItems="flex-end" height={160} gap={4}>
      {subjects.map((sub, idx) => {
        const percent = sub.total ? Math.round((sub.correct / sub.total) * 100) : 0;
        return (
          <Tooltip key={sub.name} title={`${percent}%`} arrow>
            <Box display="flex" flexDirection="column" alignItems="center" width={80}>
              <Box
                sx={{
                  width: 48,
                  height: `${percent * 1.2}px`,
                  bgcolor: colors[idx] || '#888',
                  borderRadius: 2,
                  transition: 'height 0.3s',
                  cursor: 'pointer',
                }}
              />
              <Typography variant="body2" mt={1} fontWeight={600} color="text.primary">
                {sub.name}
              </Typography>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
