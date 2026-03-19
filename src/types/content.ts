/** Conteúdo já resolvido para o idioma atual (após deepPick). */
export interface PickedContent {
  main: {
    name: string;
    role: string;
    avatar_url: string;
    social: {
      github: string;
      linkedin: string;
      credly: string;
      steam: string;
      playstation: string;
      instagram: string;
      x: string;
      facebook: string;
      spotify: string;
      /** Nome de usuário Discord (copiar para área de transferência) */
      discord: string;
      email: string;
      phone: string;
      phone_tel: string;
      whatsapp_url: string;
      location_label: string;
      location_maps_url: string;
    };
    intro_paragraphs: string[];
  };
  expertise: {
    title: string;
    cards: {
      icon: "cpu" | "network";
      title: string;
      descriptions: string[];
      stack: string[];
    }[];
  };
  certifications: {
    title: string;
    items: {
      image_url: string;
      title: string;
      description: string;
      /** Link público do selo na Credly */
      credly_url?: string;
    }[];
  };
  education: {
    title: string;
    entries: {
      date: string;
      title: string;
      location: string;
      description: string;
      logo_domain?: string;
      logo?: string;
    }[];
  };
  languages: {
    title: string;
    items: {
      name: string;
      level: string;
      communication: string;
      conversation: string;
      reading: string;
      writing: string;
      note?: string;
      flag: "br" | "us" | "es";
    }[];
  };
  history: {
    title: string;
    entries: {
      date: string;
      company: string;
      location: string;
      role: string;
      hard_skills: string[];
      soft_skills: string[];
      description: string[];
      logo_domain?: string;
    }[];
  };
  hobbies: {
    title: string;
    items: { icon: string; label: string }[];
  };
  projects: {
    section_title: string;
    items: {
      title: string;
      period: string;
      description: string;
      organization?: string;
      logo?: string;
    }[];
  };
  personal_projects: {
    section_title: string;
    items: {
      title: string;
      description: string;
      github_url: string;
      live_url?: string;
      status?: string;
    }[];
  };
  contact: { title: string; subtitle: string };
  footer: {
    credit: string;
    author_name: string;
    author_url: string;
    suffix: string;
  };
}
