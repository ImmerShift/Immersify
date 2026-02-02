import React, { useMemo } from 'react';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { generateAuditSummary, generateStrategicRoadmap } from '@/lib/utils';
import { SECTIONS } from '@/lib/constants';

const getColorTheme = (tier) => {
  if (tier === 'Superbrand') return { primary: [20, 20, 20], accent: [212, 175, 55], background: [255, 255, 255], text: [255, 255, 255] };
  if (tier === 'Star') return { primary: [88, 28, 135], accent: [236, 72, 153], background: [255, 255, 255], text: [255, 255, 255] };
  if (tier === 'Sprout') return { primary: [37, 99, 235], accent: [129, 140, 248], background: [255, 255, 255], text: [255, 255, 255] };
  return { primary: [22, 163, 74], accent: [74, 222, 128], background: [255, 255, 255], text: [255, 255, 255] };
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(`Page ${i} of ${pageCount}`, width - 70, height - 18);
    doc.text("Strategic Analysis powered by ImmerShift — Immersive Brand Experience Framework", 40, height - 18);
  }
};

const drawRadarChart = (doc, scores, centerX, centerY, radius, theme) => {
  const values = [
    scores.brand_core,
    scores.visual_identity,
    scores.product_experience,
    scores.market_plan,
    scores.technology,
    scores.brand_activation,
    scores.team_branding,
    scores.security_trust
  ];
  const angleStep = (Math.PI * 2) / values.length;
  const toPoint = (value, index, scale = 1) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius * scale;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r
    };
  };
  const ringScales = [0.25, 0.5, 0.75, 1];
  doc.setDrawColor(220, 220, 220);
  ringScales.forEach((scale) => {
    const points = values.map((_, i) => toPoint(100, i, scale));
    doc.lines(
      points.map((p, idx) => idx === 0 ? [p.x, p.y] : [p.x - points[idx - 1].x, p.y - points[idx - 1].y]),
      points[0].x,
      points[0].y,
      [1, 1],
      'S'
    );
  });
  values.forEach((_, i) => {
    const end = toPoint(100, i, 1);
    doc.line(centerX, centerY, end.x, end.y);
  });
  const polygon = values.map((v, i) => toPoint(v, i));
  doc.setDrawColor(...theme.accent);
  doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2], 0.18);
  doc.lines(
    polygon.map((p, idx) => idx === 0 ? [p.x, p.y] : [p.x - polygon[idx - 1].x, p.y - polygon[idx - 1].y]),
    polygon[0].x,
    polygon[0].y,
    [1, 1],
    'FD'
  );
};

const getMentorInsightsByPillar = (mentorFeedback) => {
  const pillarInsights = {};
  Object.entries(SECTIONS).forEach(([pillarKey, questions]) => {
    const insights = questions
      .map((q) => mentorFeedback?.[q.id])
      .filter(Boolean)
      .slice(0, 2)
      .map((entry) => ({
        concept: entry.concept,
        critique: entry.critique,
        proTip: entry.proTip
      }));
    pillarInsights[pillarKey] = insights;
  });
  return pillarInsights;
};

const ReportGenerator = () => {
  const answers = useStore((state) => state.answers);
  const ratings = useStore((state) => state.ratings);
  const brandLevel = useStore((state) => state.brandLevel);
  const mentorFeedback = useStore((state) => state.mentorFeedback);
  const summary = useMemo(() => generateAuditSummary(answers, ratings, brandLevel), [answers, ratings, brandLevel]);
  const roadmap = useMemo(() => generateStrategicRoadmap(answers, ratings, brandLevel), [answers, ratings, brandLevel]);

  const handleExport = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const width = doc.internal.pageSize.width;
    const height = doc.internal.pageSize.height;
    const theme = getColorTheme(summary.currentTier);
    const brandName = answers.company_name || answers.brand_name || 'Immersify Brand';
    const dateLabel = new Date().toLocaleDateString();

    doc.setFillColor(...theme.primary);
    doc.rect(0, 0, width, height, 'F');
    doc.setTextColor(...theme.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.text(brandName, 60, 120);
    doc.setFontSize(16);
    doc.text(`${summary.currentTier} Strategic Audit`, 60, 160);
    doc.setFont('helvetica', 'normal');
    doc.text(dateLabel, 60, 190);

    doc.addPage();
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("The 8-Pillar Map", 40, 50);
    drawRadarChart(doc, summary.pillarScores, width / 2, 220, 95, theme);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const labels = ['Brand Core', 'Visual Identity', 'Product Experience', 'Market Plan', 'Technology', 'Brand Activation', 'Team Branding', 'Security & Trust'];
    labels.forEach((label, index) => {
      doc.text(label, 50, 360 + index * 14);
    });

    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text("Executive Verdict", 40, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Strategic Bottleneck: ${summary.bottleneck.label} (${summary.bottleneck.score}%)`, 40, 90);
    const verdictLines = doc.splitTextToSize(summary.advisorMirror, width - 80);
    doc.text(verdictLines, 40, 120);
    const synergyLines = doc.splitTextToSize(summary.synergy.verdict, width - 80);
    doc.text(synergyLines, 40, 170);

    const insightsByPillar = getMentorInsightsByPillar(mentorFeedback);
    let y = 230;
    doc.setFont('helvetica', 'bold');
    doc.text("Expert Callouts", 40, y);
    y += 20;
    Object.entries(insightsByPillar).forEach(([pillarKey, insights]) => {
      if (!insights.length) return;
      insights.forEach((entry) => {
        if (y > height - 120) {
          doc.addPage();
          y = 60;
        }
        doc.setDrawColor(...theme.accent);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(40, y, width - 80, 70, 6, 6, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(pillarKey.replace(/_/g, ' ').toUpperCase(), 50, y + 16);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        const text = `Concept: ${entry.concept} | Critique: ${entry.critique} | Pro-Tip: ${entry.proTip}`;
        const lines = doc.splitTextToSize(text, width - 110);
        doc.text(lines, 50, y + 34);
        y += 90;
      });
    });

    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("30-60-90 Day Strategic Roadmap", 40, 50);
    roadmap.phases.forEach((phase, idx) => {
      const top = 90 + idx * 150;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${phase.title} — ${phase.badge}`, 40, top);
      doc.setFont('helvetica', 'normal');
      doc.text(`Focus: ${phase.pillar}`, 40, top + 20);
      const actionLines = doc.splitTextToSize(phase.action, width - 80);
      doc.text(actionLines, 40, top + 40);
      const realityLines = doc.splitTextToSize(phase.realityCheck, width - 80);
      doc.text(realityLines, 40, top + 70);
    });

    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("Next Steps", 40, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const nextSteps = [
      "Schedule a deep-dive implementation session with ImmerShift.",
      "Convert the roadmap into weekly sprints with accountable owners.",
      "Operationalize your bottleneck pillar before new acquisition spend."
    ];
    nextSteps.forEach((line, index) => {
      doc.text(`• ${line}`, 40, 90 + index * 22);
    });
    doc.setFont('helvetica', 'bold');
    doc.text("Contact: strategy@immershift.ai", 40, 180);

    addFooter(doc);
    const safeName = brandName.replace(/[^a-z0-9-_ ]/gi, '').trim().replace(/\s+/g, '_');
    const fileName = `Immersify_Strategy_${safeName}_${dateLabel.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      Download Strategic Report
    </Button>
  );
};

export default ReportGenerator;
