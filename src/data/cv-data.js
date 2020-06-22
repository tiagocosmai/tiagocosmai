export const Utils = {
    date: {
        getAge = (dateOfBirth) => {
            const date = new Date();
            const year = date.getFullYear();
            const mount = date.getMonth();
            const day = date.getDate();

            const birthYar = dateOfBirth.getFullYear();
            const birthMonth = dateOfBirth.getMonth();
            const birthDay = dateOfBirth.getDate();

            const yars = (mount < birthMonth || mount == birthMonth && day < birthDay) ? year - birthYar : (year - birthYar) - 1;

            return yars < 0 ? 0 : yars;
        }
    }
}


export const langs = [
    {
        'id': 'pt-br',
        'idx': 'pt',
        'name': { 'pt': 'Português do Brasil', 'en': 'Brazilian Portuguese', 'es': 'Portugués de Brasil' }
    },
    {
        'id': 'en-us',
        'idx': 'en',
        'name': { 'pt': 'Inglês', 'en': 'English', 'es': 'Inglés' }
    },
    {
        'id': 'es-es',
        'idx': 'es',
        'name': { 'pt': 'Espanhol', 'en': 'Spanish', 'es': 'Español' }
    }
];

export const contactType = [{
    type: 1,
    description: { 'pt': 'Rede Social', 'en': 'Social Network', 'es': 'Rede Social' }
},
{
    type: 2,
    description: { 'pt': 'Rede Social(Trabalho)', 'en': 'Social Network(Work)', 'es': 'Rede Social(trabajo)' }
},
{
    type: 3,
    description: { 'pt': 'Bate-Papo', 'en': 'Chat', 'es': 'Charla' }
},
{
    type: 4,
    description: { 'pt': 'Telefone', 'en': 'Telephone', 'es': 'Teléfono' }
},
{
    type: 5,
    description: { 'pt': 'Blog/Web Site', 'en': 'Blog/Web Site', 'es': 'Blog/Sitio web' }
},
{
    type: 6,
    description: { 'pt': 'E-mail', 'en': 'E-mail', 'es': 'E-mail' }
}
];

export const courseTypes = [
    {
        id: 1,
        show: true,
        description: { 'pt': 'Ensino Regular', 'en': 'Regular Education', 'es': 'Educación regular' }
    },
    {
        id: 2,
        show: true,
        description: { 'pt': 'Ensino Superior', 'en': 'University education', 'es': 'Enseñanza superior' }
    },
    {
        id: 3,
        show: true,
        description: { 'pt': 'Certificações', 'en': 'Certifications', 'es': 'Certificaciones' }
    },
    {
        id: 4,
        show: true,
        description: { 'pt': 'Cursos Presenciais', 'en': 'Classroom Courses', 'es': 'Cursos de aula' }
    },
    {
        id: 5,
        show: true,
        description: { 'pt': 'Cursos a Distância', 'en': 'Regular Education', 'es': 'Cursos de educación a distancia' }
    },
];


export const cvData = {
    config: {
        defaultLang: 'pt',
        sessions: [
            {
                title: {
                    description: {
                        'pt': 'Especialista em desenvolvimento Web',
                        'en': 'Web development specialist',
                        'es': 'Especialista en desarrollo web'
                    }, show: true
                },
                about: { description: { 'pt': 'Perfil Profissional', 'en': 'Professional Profile', 'es': 'Perfil profesional' }, show: true },
            }
        ]
    },
    about: {
        'pt': 'Profissional graduado em Análise e Desenvolvimento de Sistemas com mais de 12 anos de atuação em empresas de diversos segmentos. Vivência com integrações de sistemas, trabalho em grandes e pequenas equipes, capacitado para realização do trabalho desde o colhimento e especificação dos requisitos, modelagem, analise, desenvolvimento, testes integrados, homologação e implantação das entregas.',
        'en': 'Professional graduated in Systems Analysis and Development with over 12 years of experience in companies in various segments. Experience with systems integrations, work in large and small teams, trained to perform the work from the requirements gathering and specification, modeling, analysis, development, integrated tests, approval and implementation of deliveries.',
        'es': 'Profesional graduado en Análisis y Desarrollo de Sistemas con más de 12 años de experiencia en empresas de diversos segmentos. Experiencia con integraciones de sistemas, trabajo en equipos grandes y pequeños, capacitados para realizar el trabajo desde la recopilación y especificación de requisitos, modelado, análisis, desarrollo, pruebas integradas, aprobación e implementación de entregas.'
    },
    personalData: {
        birthDate: new Date(1986, 4, 16),
        age: Utils.date.getAge(new Date(1986, 4, 16)),
        cityOfBirth: {
            'pt': 'Santo André, São Paulo - Brasil',
            'en': 'Santo André, São Paulo - Brazil',
            'es': 'Santo André, São Paulo - Brasil'
        },
        cityOfBirth: {
            'pt': 'Santo André, São Paulo - Brasil',
            'en': 'Santo André, São Paulo - Brazil',
            'es': 'Santo André, São Paulo - Brasil'
        },
        geo: {
            birth: {
                lat: -23.6610572, long: -46.5392816
            },
            address: {
                lat: -23.6610572, long: -46.5392816
            }
        },
        fullName: 'Tiago Cosmai',
        firstName: 'Tiago',
        lastName: 'Cosmai',
        title: {
            'pt': 'Sr.', 'en': 'Mr.', 'es': 'Sr.'
        },
        civilState: { 'pt': 'Casado', 'en': 'Married', 'es': 'Casado' },
    },
    contactData:
        [
            {
                name: { 'pt': 'e-mail', 'en': 'e-mail', 'en': 'e-mail' },
                show: true,
                value: 'tiagocosmai@gmail.com',
                icon: 'email-icon',
                link: 'mailto:tiagocosmai@gmail.com',
                type: 6
            },
            {
                name: { 'pt': 'Skype', 'en': 'Skype', 'en': 'Skype' },
                show: true,
                value: 'tiagocosmai@gmail.com',
                icon: 'skype-icon',
                link: 'skype:tiagocosmai',
                type: 3
            },
            {
                name: { 'pt': 'Celular', 'en': 'Cell phone', 'en': 'Teléfono móvil' },
                show: true,
                value: '+55 11 9 6638 8835',
                icon: 'cellphone-icon',
                link: 'tel:5511966388835',
                type: 4
            },
            {
                name: { 'pt': 'WhatsApp', 'en': 'WhatsApp', 'es': 'WhatsApp' },
                show: true,
                value: '+55 11 9 6638 8835',
                icon: 'whatsapp-icon',
                link: 'https://api.whatsapp.com/send?phone=5511966388835',
                type: 3
            },
            {
                name: { 'pt': 'Telegram', 'en': 'Telegram', 'es': 'Telegram' },
                show: true,
                value: '+55 11 9 6638 8835/tiagocosmai',
                icon: 'telegram-icon',
                link: 'tg://resolve?domain=tiagocosmai',
                type: 3
            },
            {
                name: { 'pt': 'Facebook', 'en': 'Facebook', 'es': 'Facebook' },
                show: true,
                value: 'https://www.facebook.com/tiagocosmai',
                icon: 'facebook-icon',
                link: 'https://www.facebook.com/tiagocosmai',
                type: 1
            },
            {
                name: { 'pt': 'Twitter', 'en': 'Twitter', 'es': 'Twitter' },
                show: true,
                value: '@tiagocosmai',
                icon: 'twitter-icon',
                link: 'https://twitter.com/tiagocosmai',
                type: 1
            },
            {
                name: { 'pt': 'Instagram', 'en': 'Instagram', 'es': 'Instagram' },
                show: true,
                value: '@tiagocosmai',
                icon: 'instagram-icon',
                link: 'https://www.instagram.com/tiagocosmai/',
                type: 1
            },
            {
                name: { 'pt': 'Linkedin', 'en': 'Linkedin', 'es': 'Linkedin' },
                show: true,
                value: 'https://www.linkedin.com/in/tiagocosmai/',
                icon: 'instagram-icon',
                link: 'https://www.linkedin.com/in/tiagocosmai/',
                type: 1
            },
            {
                name: { 'pt': 'GitHub', 'en': 'GitHub', 'es': 'GitHub' },
                show: true,
                value: 'https://github.com/tiagocosmai',
                icon: 'instagram-icon',
                link: 'https://github.com/tiagocosmai',
                type: 1
            },

        ]
    ,
    jobXpData: {

    },
    courseData: {

    },
    voluntaryData: {

    },
    languagesData: {},
    eventsData: {}
};

export default cvData;



export const WebSiteSessions = [
    'Projects',
    'Curriculum',
    'Favorite Links',
    'Javascript Framework Session',
    'Geradores de códigos',
    'Dicas de Cursos Gratuítos',
    'Tutoriais',
    'Linux Session',
    'Sobre Tiago Cosmai',

]