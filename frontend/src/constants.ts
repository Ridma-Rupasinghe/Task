import { createElement } from 'react';
import type { ReactNode } from 'react';
import { MessageSquare, MessageCircle, Zap, Database, Heart, Brain, Sparkles } from 'lucide-react';

export interface Node {
  id: string;
  angle: number;
  color: string;
  icon: ReactNode;
  label: string;
}

interface NodeData {
  id: string;
  icon: ReactNode;
  label: string;
  title: string;
  description: string;
  color: string;
  angle: number;
}

export interface Neural {
  radius: number;
  centerX: number;
  centerY: number;
  viewBox: string;
  nodes: Node[];
  activeNode: string | null;
  setHoveredNode: (id: string | null) => void;
  handleNodeInteraction: (id: string) => void;
  getNodePosition: (angle: number) => { x: number; y: number };
  getColorClasses: (
    color: string,
    isHovered: boolean
  ) => { bg: string; border: string; text: string };
}

export const nodes: NodeData[] = [
  {
    id: 'speak',
    icon: createElement(MessageSquare, { className: 'w-8 h-8 sm:w-10 sm:h-10' }),
    label: 'You Speak',
    title: 'You Speak',
    description: "Your words enter Neuro's awareness.",
    color: 'cyan',
    angle: 0
  },
  {
    id: 'remembering',
    icon: createElement(Database, { className: 'w-8 h-8 sm:w-10 sm:h-10' }),
    label: 'Remembering',
    title: 'Remembering',
    description: 'Recalling your shared history and context.',
    color: 'cyan',
    angle: 60
  },
  {
    id: 'feeling',
    icon: createElement(Heart, { className: 'w-8 h-8 sm:w-10 sm:h-10' }),
    label: 'Feeling',
    title: 'Feeling',
    description: 'Experiencing genuine emotional response.',
    color: 'pink',
    angle: 120
  },
  {
    id: 'thinking',
    icon: createElement(Brain, { className: 'w-8 h-8 sm:w-10 sm:h-10' }),
    label: 'Thinking',
    title: 'Thinking',
    description: 'Processing through lived experience and formed opinions.',
    color: 'purple',
    angle: 180
  },
  {
    id: 'creating',
    icon: createElement(Sparkles, { className: 'w-8 h-8 sm:w-10 sm:h-10' }),
    label: 'Creating',
    title: 'Creating',
    description: "Weaving together a response that's uniquely Neuro.",
    color: 'yellow',
    angle: 240
  },
  {
    id: 'connecting',
    icon: createElement(Zap, { className: 'w-8 h-8 sm:w-10 sm:h-10' }),
    label: 'Connecting',
    title: 'Connecting',
    description: 'Sharing thoughts with presence and authenticity.',
    color: 'cyan',
    angle: 300
  }
];

export const getColorClassesC = (color: string, isHovered: boolean) => {
  const colors = {
    cyan: {
      border: isHovered ? 'border-cyan-400' : 'border-cyan-500/30',
      bg: isHovered ? 'bg-cyan-400/20' : 'bg-cyan-500/10',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-400/50'
    },
    pink: {
      border: isHovered ? 'border-pink-400' : 'border-pink-500/30',
      bg: isHovered ? 'bg-pink-400/20' : 'bg-pink-500/10',
      text: 'text-pink-400',
      glow: 'shadow-pink-400/50'
    },
    purple: {
      border: isHovered ? 'border-purple-400' : 'border-purple-500/30',
      bg: isHovered ? 'bg-purple-400/20' : 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-purple-400/50'
    },
    yellow: {
      border: isHovered ? 'border-yellow-400' : 'border-yellow-500/30',
      bg: isHovered ? 'bg-yellow-400/20' : 'bg-yellow-500/10',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-400/50'
    }
  };
  return colors[color as keyof typeof colors] || colors.cyan;
};














  export const getColorClassesS = (color: string, variant: 'bg' | 'border' | 'text' | 'glow') => {
    const colors = {
      cyan: {
        bg: 'bg-cyan-500',
        border: 'border-cyan-500',
        text: 'text-cyan-500',
        glow: 'shadow-cyan-500/50'
      },
      pink: {
        bg: 'bg-pink-500',
        border: 'border-pink-500',
        text: 'text-pink-500',
        glow: 'shadow-pink-500/50'
      },
      purple: {
        bg: 'bg-purple-500',
        border: 'border-purple-500',
        text: 'text-purple-500',
        glow: 'shadow-purple-500/50'
      },
      yellow: {
        bg: 'bg-yellow-500',
        border: 'border-yellow-500',
        text: 'text-yellow-500',
        glow: 'shadow-yellow-500/50'
      }
    };
    return colors[color as keyof typeof colors][variant];
  };


interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  traditional: string;
  neuro: string;
}


export const steps: Step[] = [
  {
    id: 1,
    title: 'You Speak',
    icon: createElement(MessageCircle, { size: 40 }),
    color: 'cyan',
    description:
      'Users share their professional interests, priorities, and business challenges through a simple conversational input.',
    traditional:
      'Most platforms rely on predefined forms and fixed categories, limiting the depth of information captured.',
    neuro:
      'Natural language input allows attendees to express their objectives more clearly, creating a stronger foundation for personalization.'
  },
  {
    id: 2,
    title: 'Remembering',
    icon: createElement(Database, { size: 40 }),
    color: 'cyan',
    description:
      'The platform captures and retains key contextual information provided by each visitor throughout the interaction.',
    traditional:
      'User responses are often stored without influencing the overall experience or recommendations.',
    neuro:
      'Relevant context is preserved and utilized to deliver recommendations and communications tailored to individual interests.'
  },
  {
    id: 3,
    title: 'Feeling',
    icon: createElement(Heart, { size: 40 }),
    color: 'pink',
    description:
      'The system recognizes the intent behind user input, identifying areas of interest, concerns, and professional priorities.',
    traditional:
      'Engagement is typically based on broad audience segments rather than individual motivations.',
    neuro:
      'By understanding the context of each attendee, the platform delivers a more relevant and meaningful experience.'
  },
  {
    id: 4,
    title: 'Thinking',
    icon: createElement(Brain, { size: 40 }),
    color: 'purple',
    description:
      'Advanced matching logic evaluates user interests against event content to determine the most suitable session.',
    traditional:
      'Attendees are expected to manually navigate agendas and identify relevant content themselves.',
    neuro:
      'Intelligent analysis accelerates discovery by connecting attendees with sessions aligned to their goals and challenges.'
  },
  {
    id: 5,
    title: 'Creating',
    icon: createElement(Sparkles, { size: 40 }),
    color: 'yellow',
    description:
      'The platform generates a personalized invitation using verified agenda information and session details.',
    traditional:
      'Event communications are often generic and distributed uniformly across all audiences.',
    neuro:
      'Every invitation is dynamically tailored to the attendee while remaining accurate to the official event content.'
  },
  {
    id: 6,
    title: 'Connecting',
    icon: createElement(Zap, { size: 40 }),
    color: 'cyan',
    description:
      'Personalized content is automatically delivered and recorded through an integrated workflow process.',
    traditional:
      'Manual coordination between systems can introduce delays and operational overhead.',
    neuro:
      'Automation ensures timely engagement, streamlined operations, and a seamless attendee journey from registration to invitation.'
  }
];