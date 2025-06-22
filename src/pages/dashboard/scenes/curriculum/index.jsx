import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import CustomAccordion from '../../components/accordion';
import withDashboardWrapper from '../../../../components/dasboardPagesContainer';

// Dummy curriculum data
const dummyCurriculum = [
  {
    subject: 'Mathematics',
    courseDuration: '6 months',
    topics: [
      {
        _id: 'math_1',
        topic: 'Linear Equations',
        description: 'Learn to solve linear equations and graph them.',
        duration: '2 weeks',
        resources: ['Textbook Chapter 3', 'Khan Academy Videos', 'Practice Worksheets'],
      },
      {
        _id: 'math_2',
        topic: 'Quadratic Functions',
        description: 'Explore quadratic equations and their graphs.',
        duration: '3 weeks',
        resources: ['Textbook Chapter 5', 'Desmos Graphing Tool', 'Quizlet Flashcards'],
      },
    ],
  },
  {
    subject: 'English',
    courseDuration: '6 months',
    topics: [
      {
        _id: 'eng_1',
        topic: 'Grammar Basics',
        description: 'Master parts of speech and sentence structure.',
        duration: '2 weeks',
        resources: ['Grammarly Handbook', 'Purdue OWL', 'Practice Exercises'],
      },
      {
        _id: 'eng_2',
        topic: 'Literature Analysis',
        description: 'Analyze themes and characters in classic novels.',
        duration: '4 weeks',
        resources: ['SparkNotes', 'Textbook Chapter 8', 'Discussion Forums'],
      },
    ],
  },
  {
    subject: 'Science',
    courseDuration: '6 months',
    topics: [
      {
        _id: 'sci_1',
        topic: 'Chemical Reactions',
        description: 'Understand types of chemical reactions and balancing equations.',
        duration: '3 weeks',
        resources: ['Lab Manual', 'PhET Simulations', 'Textbook Chapter 4'],
      },
    ],
  },
  {
    subject: 'History',
    courseDuration: '6 months',
    topics: [
      {
        _id: 'hist_1',
        topic: 'World War II',
        description: 'Study the causes, events, and outcomes of WWII.',
        duration: '4 weeks',
        resources: ['History Channel Videos', 'Textbook Chapter 12', 'Primary Sources'],
      },
    ],
  },
];

const Curriculum = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ p: 3 }}>
      <Header
        title="Curriculum Overview"
        subtitle="Explore the curriculum for each subject"
      />

      {dummyCurriculum.length > 0 ? (
        dummyCurriculum.map((subject, subjectIndex) => (
          <Box key={subjectIndex} sx={{ mb: 4 }}>
            <Typography
              variant="h2"
              sx={{ color: colors.blueAccent[200], mb: 2, fontWeight: 'bold' }}
            >
              {subject.subject} ({subject.courseDuration})
            </Typography>

            {subject.topics.length > 0 ? (
              subject.topics.map((item, topicIndex) => (
                <CustomAccordion
                  key={item._id || topicIndex}
                  title={`${topicIndex + 1}. ${item.topic}`}
                  details={
                    <Box>
                      <Typography
                        variant="body1"
                        color={colors.grey[100]}
                        sx={{ mb: 1 }}
                      >
                        {item.description || 'No description available'}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontStyle: 'italic', mb: 1 }}
                      >
                        Duration: {item.duration || 'Unknown'}
                      </Typography>
                      <Typography variant="body1" sx={{ color: colors.blueAccent[200] }}>
                        Resources:{' '}
                        {Array.isArray(item.resources)
                          ? item.resources.join(', ')
                          : 'No resources available'}
                      </Typography>
                    </Box>
                  }
                  defaultExpanded={false}
                />
              ))
            ) : (
              <Typography variant="body1" color={colors.grey[100]}>
                No topics available for {subject.subject}.
              </Typography>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body1" color={colors.grey[100]}>
          No curriculum available.
        </Typography>
      )}
    </Box>
  );
};

export default withDashboardWrapper(Curriculum);