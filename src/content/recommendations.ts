export interface Recommendation {
  id: string;
  name: string;
  role: string;
  relation: string;
  paragraphs: string[];
}

export const RECOMMENDATIONS_URL = 'https://www.linkedin.com/in/sashank-deb/details/recommendations/';
export const avatarFor = (id: string) => `/assets/img/recs/${id}.webp`;

export const RECOMMENDATIONS: Recommendation[] = [
  {
    "id": "saiteja",
    "name": "Saiteja Ganapavarapu",
    "role": "Senior Software Engineer | Full-Stack & AI Engineering | Healthcare Tech",
    "relation": "Managed Sashank directly · Aug 27, 2026",
    "paragraphs": [
      "I’ve worked with a lot of engineers. Sashank Deb, who I was privileged to have on my team at RamSoft, is in the small group I’d call first if I were building a team from scratch.",
      "He’s technically sharp on React, the kind of frontend work that goes beyond making things work to making them right. But what stood out more was his instinct to do the right thing even when the shortcut was sitting right there. He’d flag the fragile fix instead of shipping it quietly, and push for the solution that would hold up rather than the one that would just get the ticket closed.",
      "That combination - real technical depth paired with genuine care about getting it right is rarer than it should be. Strongest possible recommendation."
    ]
  },
  {
    "id": "abhishek",
    "name": "Abhishek Dixit",
    "role": "Shipping Scalable Web & Mobile Products | Agentic Engineering",
    "relation": "Senior colleague · Aug 27, 2026",
    "paragraphs": [
      "Sashank is one of those people I’ve had the privilege of watching grow from a sharp college graduate into a highly dependable full-stack engineer. I’ve worked with him for close to 5 years, and I still remember interviewing him during our college placements. He stood out right away with his strong CS fundamentals, problem-solving ability, and sharp technical thinking.",
      "Over the years, Sashank has grown tremendously and established himself as a reliable team member with strong full-stack development capabilities. While I haven’t directly managed him, we’ve collaborated across multiple projects, and he consistently exceeded expectations. His ownership, technical skills, and commitment to delivering quality work have always been impressive.",
      "One thing that particularly stands out is his eye for detail and pixel-perfect delivery. He cares about getting things right, not just getting them done. Beyond his technical strengths, he’s also a genuinely fun person to work with and someone who brings great energy to the team.",
      "Sashank is the kind of person who can adapt to any role, fit into any team, and make an impact. I’d highly recommend him to any organization looking for a talented, dependable, and versatile engineer."
    ]
  },
  {
    "id": "riddhish",
    "name": "Riddhish Bambhroliya",
    "role": "Software Developer at RamSoft | C#, .NET, Azure, React, SQL Server | Healthcare SaaS",
    "relation": "Senior colleague · Aug 27, 2026",
    "paragraphs": [
      "I had the privilege of collaborating with Sashank on several high‑impact initiatives within our team, most notably the development of the agentic workflow that we co‑designed. This solution eliminated roughly 90 % of the manual effort that previously required extensive coding and maintenance. The project demanded rapid mastery of a complex new technology stack, and Sashank not only absorbed the concepts quickly but also demonstrated a deep understanding of their constraints and opportunities, enabling us to engineer a robust, scalable solution.",
      "Beyond his technical expertise, Sashank consistently contributes strategic insight to our product roadmap. He evaluates feature proposals with a critical eye, advising on what to prioritize, what to skip, and where to invest the most leverage. His input has repeatedly steered our direction toward more impactful outcomes, proving invaluable to the team’s success. I wholeheartedly recommend taking advantage of his skill set and dedication."
    ]
  },
  {
    "id": "venkata",
    "name": "Venkata Karthik Belusonti",
    "role": "Senior Product Manager | SDLC | B2B & B2C SaaS | PMP® | CSPO",
    "relation": "Managed Sashank directly · Aug 26, 2026",
    "paragraphs": [
      "I had the pleasure of working with Sashank and was consistently impressed by his technical expertise, problem-solving ability, and ownership. He is a highly collaborative developer who understands product requirements, tackles complex challenges effectively, and delivers high-quality solutions.",
      "As a Product Manager, I truly valued his reliability, proactive approach, and partnership throughout the product development lifecycle. I would highly recommend Sashank to any team looking for a strong and dependable engineering professional."
    ]
  },
  {
    "id": "vo",
    "name": "Vo Van",
    "role": "Software developer",
    "relation": "Same team · Aug 27, 2026",
    "paragraphs": [
      "I highly recommend Sashank as a Frontend Developer. Having been his colleague for nearly 3 years, I’ve always admired his ability to learn fast and adapt to new technologies seamlessly. He possesses a deep understanding of Microsoft’s B2C platform, which was crucial for our project's success. Even under tight deadlines and high pressure, Sashank remains calm, focused, and consistently delivers high-quality code. He is a fantastic teammate and a great asset to any tech team."
    ]
  },
  {
    "id": "ayonija",
    "name": "Ayonija Mathur",
    "role": "Senior Software Engineer @ BNY | Platform & AI Systems | MCP · Java · Spring Boot · TypeScript",
    "relation": "Worked together at PALS, VIT · Nov 13, 2026",
    "paragraphs": [
      "I had the pleasure of working with Sashank during our time at PALS, VIT Chennai, and what always stood out was his ability to turn ideas into action. He was someone who consistently took initiative, thought beyond his immediate responsibilities, and looked for ways to create a meaningful impact.",
      "Sashank played an instrumental role in strengthening PALS, from building its digital presence and connecting students with industry leaders through IIT Madras's startup incubation ecosystem to organising hackathons that opened doors for talented students.",
      "What sets him apart is his ownership, problem-solving mindset, and ability to bring people together around a common goal. He combines strong technical abilities with excellent execution and a genuine willingness to help others grow.",
      "Sashank is someone who doesn't just participate but actively makes things happen. I would wholeheartedly recommend him to any team looking for a driven, dependable, and capable engineer."
    ]
  }
];
