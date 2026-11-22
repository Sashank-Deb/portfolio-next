export interface SkillGroup {
  title: string;
  icon: string;
  chips: string[];
  wide?: boolean;
}

export const SKILLS: SkillGroup[] = [
  {
    title: 'Languages',
    icon: 'uil-brackets-curly',
    chips: ['JavaScript', 'TypeScript', 'Java', 'HTML', 'CSS / SCSS'],
  },
  {
    title: 'Frameworks & libraries',
    icon: 'uil-react',
    chips: [
      'React',
      'Next.js',
      'Node.js',
      'Angular',
      'Vue',
      'Redux',
      'MUI',
      'TanStack',
      'Three.js / WebGL',
    ],
  },
  {
    title: 'Backend, security & healthcare',
    icon: 'uil-shield-check',
    chips: [
      'REST APIs',
      'GraphQL',
      'Azure AD B2C',
      'Entra ID',
      'SSO',
      'HL7 FHIR',
      'DICOM',
      'HIPAA',
    ],
  },
  {
    title: 'Testing, cloud & tools',
    icon: 'uil-flask',
    chips: [
      'Jest',
      'Storybook',
      'Cypress',
      'Playwright',
      'SonarCloud',
      'Azure',
      'Datadog',
      'CI/CD',
      'Figma',
    ],
  },
  {
    title: 'Core engineering',
    icon: 'uil-layer-group',
    chips: [
      'Web performance optimisation',
      'System design',
      'Data structures',
      'Agile',
      'Frontend architecture',
      'Technical leadership',
    ],
    wide: true,
  },
];
