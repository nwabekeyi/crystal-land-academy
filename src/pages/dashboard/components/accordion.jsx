import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';

const CustomAccordion = ({
  title,
  details,
  actions = null, // Optional actions
  defaultExpanded = false, // Control whether accordion is expanded by default
}) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Accordion defaultExpanded={defaultExpanded} sx={{backgroundColor: theme.palette.mode === "light" ? colors.grey[900] : colors.primary[500]}}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title.replace(/\s+/g, '-').toLowerCase()}-content`}
        id={`${title.replace(/\s+/g, '-').toLowerCase()}-header`}
      >
        <Typography 
          variant="h6" 
          sx={{
            color: colors.blueAccent[200],
            fontWeight: 'bold',
            fontSize: '1.2rem', // Similar to Instagram style
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {typeof details === 'string' ? <Typography>{details}</Typography> : details}
      </AccordionDetails>
      {actions && (
        <AccordionActions sx={{ justifyContent: 'center', marginTop: 2 }}>
          {actions.map((action, index) => (
            <Button 
              key={index} 
              onClick={action.onClick} 
              variant="contained"
              color="primary"
            >
              {action.label}
            </Button>
          ))}
        </AccordionActions>
      )}
    </Accordion>
  );
};

export default CustomAccordion;
