export interface Certificate { name: string; kind: 'role' | 'skill'; id: string }

export const HACKERRANK_PROFILE = 'https://www.hackerrank.com/profile/sashankdebrgu7';
export const certificateUrl = (id: string) => `https://www.hackerrank.com/certificates/${id}`;

export const CERTIFICATES: Certificate[] = [
  { name: 'Frontend Developer (React)', kind: 'role', id: '384980329822' },
  { name: 'React (Basic)', kind: 'skill', id: '777aed4d3fef' },
  { name: 'JavaScript (Intermediate)', kind: 'skill', id: 'e9f88dae83b1' },
  { name: 'JavaScript (Basic)', kind: 'skill', id: '5df32b19353d' },
  { name: 'SQL (Basic)', kind: 'skill', id: '6d838ea2b363' },
  { name: 'SQL (Intermediate)', kind: 'skill', id: 'bf159479417c' },
  { name: 'CSS (Basic)', kind: 'skill', id: '7262c92d1253' },
];
