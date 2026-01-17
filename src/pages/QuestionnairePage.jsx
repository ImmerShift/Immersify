import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import InitialAssessment from '@/components/questionnaire/InitialAssessment';
import MainQuestionnaire from '@/components/questionnaire/MainQuestionnaire';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';

export default function QuestionnairePage() {
  const queryClient = useQueryClient();

  // Fetch existing questionnaire
  const { data: questionnaires, isLoading } = useQuery({
    queryKey: ['questionnaires'],
    queryFn: api.questionnaire.get
  });

  const createMutation = useMutation({
    mutationFn: api.questionnaire.save,
    onSuccess: () => {
      queryClient.invalidateQueries(['questionnaires']);
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center pt-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const currentQuestionnaire = questionnaires?.[0];

  return (
    <Layout>
      {currentQuestionnaire ? (
        <MainQuestionnaire questionnaire={currentQuestionnaire} />
      ) : (
        <InitialAssessment onComplete={(answers, tier) => {
          createMutation.mutate({
            maturity_tier: tier,
            assessment_data: answers,
            responses: {}
          });
        }} />
      )}
    </Layout>
  );
}