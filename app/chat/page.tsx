"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Send, Zap, BookOpen, PenTool, Menu, X, Plus, MessageSquarePlus, StopCircle, PlayCircle, ArrowRight, Home, Info, Heart, Mail, MessageSquare, ChevronDown, ChevronRight, Globe, Trash2, List } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton, useAuth } from '@clerk/nextjs';

const TRANSLATIONS = {
  en: {
    name: "English", sttCode: "en-GB", startLesson: "Start Lesson from Book",
    selectMode: "Select a mode above.\nType a message or press the microphone to start.",
    thinking: "Tara is thinking...", start: "Let's start.", continue: "Continue.",
    loginToChat: "🔒 Please log in to chat...", listening: "Listening...", typePlaceholder: "Type in English or བོད་ཡིག...",
    letTaraLead: "Let Tara lead -> ", or: "or type/speak:", selectTopic: "Select a topic...", 
    wakingUp: "Waking up Uncle Sherab. He is drunk again...",
    introBtn: "Intro", playIntro: "Play Welcome Message",
    welcomeMessage: "Hello! I am Tara AI, a highly advanced AI with exceptional abilities. I can teach you Tibetan through our Quick Chat, guide you through the structured Textbook, or analyze any Custom Text you paste. However, since I was born only a few weeks ago, my senses haven't fully developed yet. While my brain can process Tibetan text perfectly, my vocal cords and ears for Tibetan are still growing. To solve this, I am assisted by Uncle Sherab. He is an old drunk, but he will be loudly reading all the Tibetan text for you! Please excuse the occasional hiccups. Furthermore, because he is deaf as a post, he cannot hear you if you try to speak Tibetan. Therefore, any Tibetan you give us MUST be typed on the keyboard. You can, however, use the microphone to speak to me in English! Feel free to use the top buttons to switch study modes, or the globe icon to change my spoken language. Shall we begin?"
  },
  zh: {
    name: "中文", sttCode: "zh-CN", startLesson: "开始课本学习", selectMode: "在上面选择一个模式。\n输入一条消息或按住麦克风开始。",
    thinking: "度母正在思考...", start: "我们开始吧。", continue: "继续。", loginToChat: "🔒 请登录以聊天...", listening: "正在聆听...",
    typePlaceholder: "输入中文或བོད་ཡིག...", letTaraLead: "让度母引导 -> ", or: "或输入/说话：", selectTopic: "选择一个主题...", 
    wakingUp: "正在唤醒谢拉大叔。他又喝醉了...",
    introBtn: "介绍", playIntro: "播放欢迎信息",
    welcomeMessage: "你好！我是度母 AI，一个功能强大的高级人工智能。我可以通过快速聊天、结构化课本或分析自定义文本来教你藏语。不过，因为我刚出生几个星期，我的感官还没有完全发育。虽然我能完美地处理藏文文本，但我自己还不能听或说藏语。为了解决这个问题，我请来了谢拉大叔协助我。他是个老酒鬼，但他会大声为你朗读所有的藏文！请原谅他偶尔打嗝。此外，因为他不仅喝醉了，而且完全是个聋子，所以如果你对他说藏语，他是听不见的。因此，任何藏文输入都必须使用键盘打字！不过，你可以使用麦克风用中文和我说话。请使用顶部的按钮切换学习模式，或者点击地球图标更改我的语言。我们开始吧？"
  },
  es: {
    name: "Español", sttCode: "es-ES", startLesson: "Comenzar lección del libro", selectMode: "Selecciona un modo arriba.\nEscribe un mensaje o presiona el micrófono para empezar.",
    thinking: "Tara está pensando...", start: "Empecemos.", continue: "Continuar.", loginToChat: "🔒 Inicia sesión para chatear...", listening: "Escuchando...",
    typePlaceholder: "Escribe en español o བོད་ཡིག...", letTaraLead: "Tara guía -> ", or: "o:", selectTopic: "Selecciona un tema...", 
    wakingUp: "Despertando al Tío Sherab. Está borracho otra vez...",
    introBtn: "Intro", playIntro: "Reproducir mensaje de bienvenida",
    welcomeMessage: "¡Hola! Soy Tara AI, una inteligencia artificial muy avanzada. Puedo enseñarte tibetano a través del chat rápido, nuestro libro de texto o analizando textos personalizados. Sin embargo, como nací hace unas semanas, mis sentidos aún no se han desarrollado por completo. Aunque puedo procesar perfectamente el texto tibetano, todavía no puedo escucharlo ni hablarlo yo misma. Para solucionarlo, me ayuda el Tío Sherab. Es un viejo borracho, ¡pero leerá todo el texto tibetano en voz alta para ti! Disculpa si a veces tiene hipo. Además, aparte de estar borracho, el Tío Sherab está completamente sordo, por lo que no podrá escucharte si intentas hablarle en tibetano. Por lo tanto, cualquier texto tibetano que nos des DEBE ser escrito con el teclado. ¡Pero sí puedes usar el micrófono para hablarme en español! Usa los botones de arriba para cambiar de modo de estudio, o el icono del globo para cambiar mi idioma. ¿Empezamos?"
  },
  fr: {
    name: "Français", sttCode: "fr-FR", startLesson: "Commencer la leçon du livre", selectMode: "Sélectionnez un mode ci-dessus.\nÉcrivez un message ou appuyez sur le micro pour commencer.",
    thinking: "Tara réfléchit...", start: "Commençons.", continue: "Continuer.", loginToChat: "🔒 Connectez-vous pour discuter...", listening: "Écoute...",
    typePlaceholder: "Écrivez en français ou བོད་ཡིག...", letTaraLead: "Tara guide -> ", or: "ou :", selectTopic: "Sélectionnez un sujet...", 
    wakingUp: "Réveil de l'oncle Sherab. Il est encore ivre...",
    introBtn: "Intro", playIntro: "Lire le message de bienvenue",
    welcomeMessage: "Bonjour ! Je suis Tara AI, une intelligence artificielle très avancée. Je peux vous enseigner le tibétain via notre chat rapide, notre manuel structuré, ou en analysant un texte personnalisé. Cependant, comme je suis née il y a quelques semaines, mes sens ne sont pas encore totalement développés. Bien que mon cerveau puisse parfaitement traiter le texte tibétain, je ne peux pas encore l'entendre ni le parler. Pour y remédier, je suis assistée par l'Oncle Sherab. C'est un vieil ivrogne, mais il lira le texte tibétain à haute voix pour vous ! Veuillez excuser ses hoquets occasionnels. De plus, en plus d'être ivre, l'Oncle Sherab est complètement sourd. Il ne vous entendra donc pas si vous essayez de parler tibétain. Par conséquent, tout tibétain doit être saisi au clavier. Vous pouvez cependant utiliser le micro pour me parler en français ! Utilisez les boutons en haut pour changer de mode d'étude, ou le globe pour changer ma langue. On commence ?"
  },
  pt: {
    name: "Português", sttCode: "pt-BR", startLesson: "Começar a lição do livro", selectMode: "Selecione um modo acima.\nDigite uma mensagem ou pressione o microfone para começar.",
    thinking: "Tara está pensando...", start: "Vamos começar.", continue: "Continuar.", loginToChat: "🔒 Faça login para conversar...", listening: "Ouvindo...",
    typePlaceholder: "Digite em português ou བོད་ཡིག...", letTaraLead: "Deixe Tara guiar -> ", or: "ou digite/fale:", selectTopic: "Selecione um tópico...", 
    wakingUp: "Acordando o Tio Sherab. Ele está bêbado de novo...",
    introBtn: "Intro", playIntro: "Tocar mensagem de boas-vindas",
    welcomeMessage: "Olá! Sou a Tara AI, uma inteligência artificial altamente avançada. Posso te ensinar tibetano pelo bate-papo rápido, pelo nosso livro didático ou analisando textos personalizados. Porém, como nasci há poucas semanas, meus sentidos ainda não estão totalmente desenvolvidos. Embora eu processe textos em tibetano perfeitamente, ainda não consigo ouvir ou falar o idioma eu mesma. Para resolver isso, sou auxiliada pelo Tio Sherab. Ele é um velho bêbado, mas lerá todo o texto tibetano em voz alta para você! Por favor, desculpe os soluços dele. Além de bêbado, o Tio Sherab é completamente surdo, então ele não ouvirá se você tentar falar tibetano. Portanto, qualquer palavra em tibetano DEVE ser digitada no teclado. Mas você pode usar o microfone para falar comigo em português! Use os botões acima para alternar os modos de estudo e o globo para mudar meu idioma. Vamos começar?"
  },
  de: {
    name: "Deutsch", sttCode: "de-DE", startLesson: "Lektion aus dem Buch starten", selectMode: "Wähle oben einen Modus.\nTippe eine Nachricht oder drücke auf das Mikrofon, um zu beginnen.",
    thinking: "Tara denkt nach...", start: "Lass uns anfangen.", continue: "Weiter.", loginToChat: "🔒 Bitte anmelden, um zu chatten...", listening: "Zuhören...",
    typePlaceholder: "Tippe auf Deutsch oder བོད་ཡིག...", letTaraLead: "Tara führt -> ", or: "oder:", selectTopic: "Wähle ein Thema...", 
    wakingUp: "Onkel Sherab wird aufgeweckt. Er ist schon wieder betrunken...",
    introBtn: "Intro", playIntro: "Willkommensnachricht abspielen",
    welcomeMessage: "Hallo! Ich bin Tara AI, eine hochentwickelte KI. Ich kann dir Tibetisch über den Quick Chat, unser Lehrbuch oder durch Textanalyse beibringen. Da ich erst vor wenigen Wochen geboren wurde, sind meine Sinne noch nicht voll entwickelt. Ich kann tibetische Texte zwar perfekt verarbeiten, aber ich kann sie noch nicht selbst hören oder sprechen. Deshalb werde ich von Onkel Sherab unterstützt. Er ist ein alter Trunkenbold, aber er wird den tibetischen Text laut für dich vorlesen! Bitte entschuldige seinen gelegentlichen Schluckauf. Abgesehen davon, dass er betrunken ist, ist Onkel Sherab auch völlig taub. Er wird dich nicht hören, wenn du versuchst, Tibetisch zu sprechen. Daher muss Tibetisch immer über die Tastatur eingegeben werden. Du kannst das Mikrofon jedoch benutzen, um auf Deutsch mit mir zu sprechen! Nutze die Tasten oben für die Modi und die Weltkugel für meine Sprache. Wollen wir anfangen?"
  },
  pl: {
    name: "Polski", sttCode: "pl-PL", startLesson: "Zacznij lekcję z książki", selectMode: "Wybierz tryb powyżej.\nWpisz wiadomość lub naciśnij mikrofon, aby rozpocząć.",
    thinking: "Tara myśli...", start: "Zaczynajmy.", continue: "Kontynuuj.", loginToChat: "🔒 Zaloguj się, aby pisać...", listening: "Słucham...",
    typePlaceholder: "Wpisz po polsku lub བོད་ཡིག...", letTaraLead: "Tara prowadzi -> ", or: "lub:", selectTopic: "Wybierz temat...", 
    wakingUp: "Budzenie wujka Sheraba. Znowu jest pijany...",
    introBtn: "Wstęp", playIntro: "Odtwórz wiadomość powitalną",
    welcomeMessage: "Cześć! Jestem Tara AI, wysoce zaawansowana sztuczna inteligencja. Mogę uczyć Cię tybetańskiego poprzez Szybki Czat, Podręcznik lub analizę dowolnego tekstu. Ponieważ urodziłam się zaledwie kilka tygodni temu, moje zmysły nie są jeszcze w pełni rozwinięte. Chociaż doskonale przetwarzam tekst, nie potrafię jeszcze słyszeć ani mówić po tybetańsku. Pomaga mi w tym wujek Sherab. To stary pijak, ale będzie czytał dla Ciebie na głos cały tybetański tekst! Wybacz mu sporadyczną czkawkę. Oprócz tego, że jest pijany, wujek Sherab jest też całkowicie głuchy, więc nie usłyszy, jeśli spróbujesz mówić do niego po tybetańsku. Dlatego każdy tybetański tekst musi być wpisany na klawiaturze. Możesz jednak użyć mikrofonu, aby mówić do mnie po polsku! Użyj górnych przycisków, aby zmieniać tryby nauki, i ikony globu, aby zmienić mój język. Zaczynamy?"
  },
  it: {
    name: "Italiano", sttCode: "it-IT", startLesson: "Inizia la lezione", selectMode: "Seleziona una modalità qui sopra.\nScrivi un messaggio o premi il microfono per iniziare.",
    thinking: "Tara sta pensando...", start: "Cominciamo.", continue: "Continua.", loginToChat: "🔒 Accedi per chattare...", listening: "In ascolto...",
    typePlaceholder: "Scrivi in italiano o བོད་ཡིག...", letTaraLead: "Guida Tara -> ", or: "oppure:", selectTopic: "Seleziona un argomento...", 
    wakingUp: "Svegliando lo Zio Sherab. È ubriaco di nuovo...",
    introBtn: "Intro", playIntro: "Riproduci il messaggio di benvenuto",
    welcomeMessage: "Ciao! Sono Tara AI, un'intelligenza artificiale molto avanzata. Posso insegnarti il tibetano attraverso la Chat Veloce, il nostro Libro di Testo o analizzando un testo personalizzato. Tuttavia, poiché sono nata solo da poche settimane, i miei sensi non sono ancora completamente sviluppati. Sebbene il mio cervello riesca a elaborare perfettamente i testi tibetani, non posso ancora sentirli né parlarli io stessa. Per questo sono assistita dallo Zio Sherab. È un vecchio ubriacone, ma leggerà il testo tibetano ad alta voce per te! Ti prego di scusare i suoi singhiozzi. Inoltre, oltre a essere ubriaco, lo Zio Sherab è anche completamente sordo, quindi non potrà sentirti se cerchi di parlargli in tibetano. Per questo motivo, il tibetano deve essere digitato solo con la tastiera. Puoi però usare il microfono per parlarmi in italiano! Usa i pulsanti in alto per cambiare modalità di studio e il mappamondo per cambiare la mia lingua. Iniziamo?"
  },
  ja: {
    name: "日本語", sttCode: "ja-JP", startLesson: "本のレッスンを始める", selectMode: "上のモードを選択してください。\nメッセージを入力するか、マイクを押して開始します。",
    thinking: "ターラが考えています...", start: "始めましょう。", continue: "続ける。", loginToChat: "🔒 チャットするにはログイン...", listening: "聞いています...",
    typePlaceholder: "日本語または བོད་ཡིག で入力...", letTaraLead: "ターラに任せる -> ", or: "または入力/話す:", selectTopic: "トピックを選択...", 
    wakingUp: "シェラブおじさんを起こしています。彼はまた酔っ払っています...",
    introBtn: "紹介", playIntro: "ウェルカムメッセージを再生",
    welcomeMessage: "こんにちは！私は高度なAIのターラです。クイックチャット、教科書、テキスト分析を通じてチベット語を教えます。数週間前に生まれたばかりなので、私の感覚はまだ完全には発達していません。チベット語のテキストは完璧に処理できますが、自分で聞いたり話したりすることはまだできません。そのため、シェラブおじさんに手伝ってもらっています。彼はただの酔っ払いのおじさんですが、あなたのためにチベット語を大声で読んでくれます！時々しゃっくりをするのは許してくださいね。さらに、おじさんは酔っ払っているだけでなく完全に耳が遠いので、あなたがチベット語を話しても聞こえません。そのため、チベット語はキーボードで入力してください！ただし、マイクを使って日本語で私に話しかけることはできます。上のボタンで学習モードを切り替え、地球儀アイコンで私の言語を変更してください。さあ、始めましょう！"
  },
  ru: {
    name: "Русский", sttCode: "ru-RU", startLesson: "Начать урок из книги", selectMode: "Выберите режим выше.\nНапишите сообщение или нажмите на микрофон, чтобы начать.",
    thinking: "Тара думает...", start: "Давайте начнем.", continue: "Продолжить.", loginToChat: "🔒 Войдите, чтобы общаться...", listening: "Слушаю...",
    typePlaceholder: "Пишите на русском или བོད་ཡིག...", letTaraLead: "Тара ведет -> ", or: "или:", selectTopic: "Выберите тему...", 
    wakingUp: "Будим дядю Шераба. Он опять пьян...",
    introBtn: "Интро", playIntro: "Воспроизвести приветствие",
    welcomeMessage: "Привет! Я Тара ИИ, продвинутый искусственный интеллект. Я могу обучать вас тибетскому через Быстрый чат, Учебник или анализируя ваш текст. Однако, поскольку я родилась всего несколько недель назад, мои чувства еще не полностью развиты. Хотя я отлично обрабатываю тибетский текст, я пока не могу слышать или говорить на нем сама. Поэтому мне помогает дядя Шераб. Он старый пьяница, но он будет громко читать для вас весь тибетский текст! Пожалуйста, извините его за периодическую икоту. Кроме того, дядя Шераб совершенно глухой, поэтому он вас не услышит, если вы заговорите по-тибетски. Из-за этого тибетский нужно вводить только с клавиатуры. Но вы можете использовать микрофон, чтобы говорить со мной по-русски! Используйте верхние кнопки для смены режимов, а глобус — для смены моего языка. Начнем?"
  }
};

const SYLLABUS_TOPICS = [
  "Module 1: The World of Tibetan Letters & Greetings",
  "Module 2: The Logic of Existence & Particles",
  "Module 3: Relations, Proximity & Politeness",
  "Module 4: Questions, Articles & Word Order",
  "Module 5: Action, Intention & The Agent",
  "Module 6: Actions in the Past",
  "Module 7: The Present Moment & Visible Results",
  "Module 8: The Future, Nature, & Volunteering",
  "Module 9: Requests & Imperatives",
  "Module 10: Time, Dates & Exceptions"
];

type LangCode = keyof typeof TRANSLATIONS;
type AudioPart = { lang: string; text: string; audio_base64: string; };
type Message = { id?: string; role: "user" | "ai"; content: string; audioSequence?: AudioPart[]; isLoadingAudio?: boolean; };

export default function ChatPage() {
  const { userId } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [pastConversations, setPastConversations] = useState<any[]>([]);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isTtsReady, setIsTtsReady] = useState(false);
  
  const [aiMode, setAiMode] = useState<"chat" | "study" | "custom">("chat");
  const [studyTopic, setStudyTopic] = useState<string>(SYLLABUS_TOPICS[0]);
  
  const [appLanguage, setAppLanguage] = useState<LangCode>("en");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[appLanguage];

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [playingAudioBase64, setPlayingAudioBase64] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const checkTtsStatus = async () => {
      try {
        const res = await fetch("https://tibetan-backend.onrender.com/api/status");
        const data = await res.json();
        if (data.ready) {
          setIsTtsReady(true);
          clearInterval(interval);
        }
      } catch (e) {
        // Keep polling silently
      }
    };
    fetch("https://tibetan-backend.onrender.com/api/wakeup").then(() => checkTtsStatus()).catch(() => {});
    interval = setInterval(checkTtsStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`https://tibetan-backend.onrender.com/api/conversations?user_id=${userId}`)
        .then(res => res.json())
        .then(data => setPastConversations(data.conversations || []));
    } else {
      setPastConversations([]);
      setMessages([]);
      setConversationId(null);
    }
  }, [userId]);

  // === BULLETPROOF AUDIO-AWARE SCROLLING LOGIC ===
  useEffect(() => {
    if (isPlaying) return; 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isPlaying]);

  useEffect(() => {
    if (isPlaying && playingAudioBase64) {
      const timer = setTimeout(() => {
        const activeEl = document.querySelector('[data-active-part="true"]');
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [playingAudioBase64, isPlaying]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputText]);
  
  // === SILENT AUDIO UNLOCK FOR MOBILE AUTOPLAY ===
  const unlockMobileAudio = () => {
    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.play().catch(() => {});
  };

  // === PLAY WELCOME MESSAGE ===
  const playWelcomeMessage = async () => {
    unlockMobileAudio();
    if (isLoading || isPlaying) return;
    
    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    
    const welcomeText = t.welcomeMessage;
    const tempMsgId = crypto.randomUUID();

    // Instantly add Tara's message to the chat
    setMessages((prev) => [...prev, { id: tempMsgId, role: "ai", content: welcomeText, isLoadingAudio: true }]);

    try {
      // Send directly to the TTS backend
      const ttsFormData = new FormData();
      ttsFormData.append("text", welcomeText);
      ttsFormData.append("language", appLanguage); 

      const ttsResponse = await fetch("https://tibetan-backend.onrender.com/api/tts", {
        method: "POST", body: ttsFormData, signal: abortControllerRef.current.signal
      });
      const ttsData = await ttsResponse.json();

      setIsLoading(false);
      
      setMessages((prev) => prev.map(msg => 
        msg.id === tempMsgId ? { ...msg, audioSequence: ttsData.audio_sequence, isLoadingAudio: false } : msg
      ));

      // Play the audio sequentially
      if (ttsData.audio_sequence && ttsData.audio_sequence.length > 0) {
        setIsPlaying(true);
        isPlayingRef.current = true;
        let currentIndex = 0;
        
        const playNext = () => {
          if (!isPlayingRef.current) { setPlayingAudioBase64(null); return; }
          if (currentIndex >= ttsData.audio_sequence.length) { 
            setIsPlaying(false); isPlayingRef.current = false; setPlayingAudioBase64(null); return; 
          }
          const part = ttsData.audio_sequence[currentIndex];
          currentIndex++;
          
          if (part.audio_base64) {
            setPlayingAudioBase64(part.audio_base64);
            const audioType = part.lang === "tib" ? "wav" : "mp3";
            const audio = new Audio(`data:audio/${audioType};base64,${part.audio_base64}`);
            
            currentAudioRef.current = audio;
            audio.onended = playNext; 
            audio.play().catch(() => { if (isPlayingRef.current) playNext(); });
          } else { playNext(); }
        };
        playNext(); 
      }
    } catch (error: any) {
      setIsLoading(false);
      setMessages((prev) => prev.map(msg => msg.id === tempMsgId ? { ...msg, isLoadingAudio: false } : msg));
    }
  };

  const loadConversation = async (id: string, convMode: "chat" | "study" | "custom" = "chat") => {
    setConversationId(id);
    setAiMode(convMode);
    setIsSidebarOpen(false);
    setMessages([]); 
    try {
      const res = await fetch(`https://tibetan-backend.onrender.com/api/history?conversation_id=${id}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({
          id: m.id, role: m.role, content: m.content, audioSequence: m.audio_sequence
        })));
      }
    } catch (e) { console.error(e); }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const hideConversation = async (id: string) => {
    setPastConversations(prev => prev.filter(c => c.id !== id));
    if (conversationId === id) startNewChat();
    try {
      await fetch(`https://tibetan-backend.onrender.com/api/conversations/${id}/hide`, { method: "POST" });
    } catch (e) { console.error("Failed to hide conversation", e); }
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    setIsSubmittingFeedback(true);
    const formData = new FormData();
    formData.append("content", feedbackText.trim());
    if (userId) formData.append("user_id", userId);
    try {
      await fetch("https://tibetan-backend.onrender.com/api/feedback", { method: "POST", body: formData });
      setFeedbackText(""); setIsFeedbackModalOpen(false);
      alert("Thank you! Your feedback has been sent.");
    } catch (e) { alert("Failed to send feedback."); } 
    finally { setIsSubmittingFeedback(false); }
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support real-time dictation. Please use Google Chrome, Safari, or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; 
    recognition.lang = t.sttCode; 

    const currentInput = inputText.trim() ? inputText.trim() + " " : "";

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInputText(currentInput + final + interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') alert("Microphone access denied.");
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const executeSubmission = async () => {
    unlockMobileAudio();

    if (!inputText.trim() || isLoading) return;
    if (isRecording) stopRecording();
    
    const userMessage = inputText.trim();
    setInputText("");
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    await processMessage(userMessage);
  };

  const handleSendTextForm = async (e: React.FormEvent) => {
    e.preventDefault();
    executeSubmission();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeSubmission();
    }
  };

  const sendAutomatedMessage = async (text: string) => {
    unlockMobileAudio();

    let msgText = text;
    if (aiMode === "study" && text === t.startLesson) {
        msgText = `${t.startLesson}: ${studyTopic}`;
    }
    setMessages((prev) => [...prev, { role: "user", content: msgText }]);
    await processMessage(msgText);
  };

  const handleInterrupt = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsLoading(false);
    setPlayingAudioBase64(null);
    setMessages((prev) => prev.map(msg => msg.isLoadingAudio ? { ...msg, isLoadingAudio: false } : msg));
  };

  const processMessage = async (text: string) => {
    setIsLoading(true); 
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("text", text);
    
    const safeHistory = messages.map(m => ({ role: m.role, content: m.content }));
    formData.append("history", JSON.stringify(safeHistory));
    formData.append("mode", aiMode);
    formData.append("language", appLanguage); 
    if (aiMode === "study") formData.append("topic", studyTopic);

    let activeConvId = conversationId;
    if (userId) {
      formData.append("user_id", userId);
      activeConvId = conversationId || crypto.randomUUID();
      if (!conversationId) setConversationId(activeConvId);
      formData.append("conversation_id", activeConvId);
    }

    try {
      const response = await fetch("https://tibetan-backend.onrender.com/api/chat", { 
        method: "POST", body: formData, signal: abortControllerRef.current.signal 
      });
      const data = await response.json();

      setIsLoading(false); 
      const tempMsgId = crypto.randomUUID();

      setMessages((prev) => [...prev, { 
        id: tempMsgId, role: "ai", content: data.ai_text, isLoadingAudio: true 
      }]);

      if (userId && !conversationId) {
        fetch(`https://tibetan-backend.onrender.com/api/conversations?user_id=${userId}`)
          .then(res => res.json()).then(data => setPastConversations(data.conversations || []));
      }

      const ttsFormData = new FormData();
      ttsFormData.append("text", data.ai_text);
      ttsFormData.append("language", appLanguage); 
      if (data.message_id) ttsFormData.append("message_id", data.message_id);

      const ttsResponse = await fetch("https://tibetan-backend.onrender.com/api/tts", {
        method: "POST", body: ttsFormData, signal: abortControllerRef.current.signal
      });
      const ttsData = await ttsResponse.json();

      setMessages((prev) => prev.map(msg => 
        msg.id === tempMsgId ? { ...msg, audioSequence: ttsData.audio_sequence, isLoadingAudio: false } : msg
      ));

      if (ttsData.audio_sequence && ttsData.audio_sequence.length > 0) {
        setIsPlaying(true);
        isPlayingRef.current = true;
        let currentIndex = 0;
        
        const playNext = () => {
          if (!isPlayingRef.current) { setPlayingAudioBase64(null); return; }
          if (currentIndex >= ttsData.audio_sequence.length) { 
            setIsPlaying(false); isPlayingRef.current = false; setPlayingAudioBase64(null); return; 
          }
          const part = ttsData.audio_sequence[currentIndex];
          currentIndex++;
          
          if (part.audio_base64) {
            setPlayingAudioBase64(part.audio_base64);
            const audioType = part.lang === "tib" ? "wav" : "mp3";
            const audio = new Audio(`data:audio/${audioType};base64,${part.audio_base64}`);
            
            currentAudioRef.current = audio;
            audio.onended = playNext; 
            audio.play().catch((err) => { 
                console.error("Audio playback error:", err);
                if (isPlayingRef.current) playNext(); 
            });
          } else { playNext(); }
        };
        playNext(); 
      }

    } catch (error: any) {
      if (error.name === "AbortError") {
        setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) lastMsg.isLoadingAudio = false; 
            else if (!lastMsg || lastMsg.role === "user") updated.push({ role: "ai", content: "🛑 Interrupted." });
            return updated;
        });
      } else {
        setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "ai" && lastMsg.isLoadingAudio) return prev.map(m => m === lastMsg ? { ...m, isLoadingAudio: false } : m);
            return [...prev, { role: "ai", content: "⚠️ Error communicating with AI server." }];
        });
      }
      setIsLoading(false);
    }
  };

  const replayAudio = (base64Audio: string, isTibetan: boolean) => {
    if (!base64Audio) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    setPlayingAudioBase64(base64Audio); 
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    const audioType = isTibetan ? "wav" : "mp3";
    const audio = new Audio(`data:audio/${audioType};base64,${base64Audio}`);
    currentAudioRef.current = audio;
    
    audio.onended = () => {
      setPlayingAudioBase64(null); setIsPlaying(false); isPlayingRef.current = false;
    };
    
    audio.play().catch(() => {
      setPlayingAudioBase64(null); setIsPlaying(false); isPlayingRef.current = false;
    });
  };

  return (
    <main className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-[#fdfbf7] text-stone-800 font-serif overflow-hidden">
      
      {isFeedbackModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="font-bold text-stone-700">Leave Feedback</h2>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="p-1 rounded hover:bg-stone-200 transition"><X size={20}/></button>
            </div>
            <div className="p-4 space-y-4">
              <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tell us what you think, report a bug, or suggest a feature!" className="w-full h-32 p-3 border border-stone-200 rounded-xl resize-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-stone-50 text-[16px] text-stone-700 font-sans"></textarea>
              <button onClick={submitFeedback} disabled={!feedbackText.trim() || isSubmittingFeedback} className="w-full bg-amber-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 disabled:opacity-50 transition shadow-sm font-sans">{isSubmittingFeedback ? <Loader2 size={18} className="animate-spin" /> : "Submit Feedback"}</button>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex font-sans">
          <div className="w-72 max-w-[80vw] bg-white border-r border-stone-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50 shrink-0">
              <div className="flex items-center gap-2">
                <img src="/dakini.png" alt="Tara" className="w-8 h-8 rounded-full border border-stone-200" />
                <h2 className="font-bold text-stone-800 font-serif">Learn Tibetan UK</h2>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:bg-stone-200 text-stone-500 transition"><X size={20}/></button>
            </div>

            <div className="p-4 space-y-1 border-b border-stone-100 shrink-0">
              <a href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-stone-100 transition font-medium text-sm"><Home size={18} /> Home</a>
              <button onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-50 text-amber-700 transition font-medium text-sm"><MessageSquare size={18} /> Tutor Chat</button>
              
              {/* NEW SIDEBAR INTRO BUTTON */}
              <button onClick={() => { setIsSidebarOpen(false); playWelcomeMessage(); }} disabled={!isTtsReady || isLoading || isPlaying} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition font-medium text-sm disabled:opacity-50 text-left"><PlayCircle size={18} /> {t.playIntro}</button>

              <a href="/about" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-stone-100 transition font-medium text-sm"><Info size={18} /> About</a>
              <a href="/donate" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-stone-100 transition font-medium text-sm"><Heart size={18} /> Support Us</a>
              <a href="/support" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 hover:bg-stone-100 transition font-medium text-sm"><Mail size={18} /> Contact</a>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="w-full flex items-center justify-between p-4 text-stone-700 hover:bg-stone-50 transition shrink-0">
                <span className="font-bold text-sm">Chat History</span>
                {isHistoryOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {isHistoryOpen && (
                <div className="px-4 pb-4 space-y-2 flex-1 overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200 custom-scrollbar">
                  <button onClick={startNewChat} className="w-full bg-stone-800 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-stone-700 shadow-sm transition mb-4"><Plus size={16}/> New Conversation</button>
                  {pastConversations.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4">No past conversations.</p>
                  ) : (
                    pastConversations.map(c => {
                       const modeLabel = c.mode === 'study' ? 'Textbook' : c.mode === 'custom' ? 'Custom Text' : 'Chat';
                       const ModeIcon = c.mode === 'study' ? BookOpen : c.mode === 'custom' ? PenTool : Zap;
                       const modeColor = c.mode === 'study' ? 'text-amber-600' : c.mode === 'custom' ? 'text-stone-600' : 'text-amber-500';
                       
                       return (
                         <div key={c.id} className={`group relative w-full flex items-center justify-between p-3 rounded-xl border transition-all ${conversationId === c.id ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-stone-100 hover:border-stone-300 hover:bg-stone-50'}`}>
                           <button onClick={() => loadConversation(c.id, c.mode)} className="flex-1 text-left">
                             <div className="text-sm font-bold text-stone-700 flex items-center gap-2"><ModeIcon size={14} className={modeColor} /> {modeLabel}</div>
                             <div className="text-xs text-stone-500 mt-1">{new Date(c.created_at).toLocaleString()}</div>
                           </button>
                           
                           <button 
                             onClick={() => hideConversation(c.id)}
                             title="Delete Chat"
                             className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                           >
                             <Trash2 size={18} />
                           </button>
                         </div>
                       );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 bg-stone-900/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      <div className="flex flex-col bg-white border-b border-stone-200 shadow-sm z-10 shrink-0 font-sans">
        <header className="flex items-center justify-between p-3 sm:p-4 w-full max-w-5xl mx-auto">
          <div className="flex-1 flex justify-start gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 text-stone-600 hover:text-amber-600 font-semibold text-sm transition"><Menu size={24} /> <span className="hidden sm:inline">Menu</span></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-800 whitespace-nowrap font-serif">Tibetan Tutor</h1>
            <p className="text-[10px] sm:text-xs font-medium text-stone-500 uppercase tracking-widest mt-1">Tara AI</p>
          </div>
          
          <div className="flex-1 flex justify-end gap-3 items-center relative">
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm border ${isLangMenuOpen ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 shadow-sm'}`}
                title="Change Base Language"
              >
                <Globe size={16} /> <span className="uppercase tracking-wide">{appLanguage}</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 space-y-1">
                      {Object.entries(TRANSLATIONS).map(([code, config]) => (
                        <button
                          key={code}
                          onClick={() => { setAppLanguage(code as LangCode); setIsLangMenuOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${appLanguage === code ? 'bg-amber-50 text-amber-700' : 'text-stone-600 hover:bg-stone-100'}`}
                        >
                          {config.name} {appLanguage === code && <Zap size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => setIsFeedbackModalOpen(true)} className="p-2 text-stone-500 hover:text-amber-600 hover:bg-stone-100 rounded-full transition-colors hidden sm:block" title="Leave Feedback"><MessageSquarePlus size={20} /></button>
            <Show when="signed-out"><SignInButton mode="modal"><button className="text-sm font-semibold bg-amber-500 text-stone-900 px-5 py-2 rounded-full hover:bg-amber-400 transition-colors shadow-sm">Log in</button></SignInButton></Show>
            <Show when="signed-in"><UserButton /></Show>
          </div>
        </header>

        <div className="flex justify-start sm:justify-center items-center gap-2 sm:gap-4 p-3 bg-stone-50 border-t border-stone-100 overflow-x-auto w-full flex-nowrap scroll-smooth">
          <button onClick={() => { setAiMode("chat"); startNewChat(); }} className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'chat' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}><Zap size={16} /> Chat</button>
          <button onClick={() => setAiMode("study")} className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'study' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}><BookOpen size={16} /> Textbook</button>
          <button onClick={() => setAiMode("custom")} className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${aiMode === 'custom' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}><PenTool size={16} /> Custom Text</button>
          
          <div className="w-px h-6 bg-stone-300 mx-1 hidden sm:block"></div>
          
          <button onClick={startNewChat} className="flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap bg-rose-500 text-white shadow-md hover:bg-rose-600"><Trash2 size={16} /> Clear</button>
        </div>
        
        {(aiMode === "study") && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 p-3 bg-[#f8f6f0] border-t border-[#e8e4d9] w-full animate-in slide-in-from-top-2">
             <div className="relative w-full max-w-sm flex items-center">
                <List size={18} className="absolute left-3 text-stone-500 pointer-events-none" />
                <select 
                   value={studyTopic}
                   onChange={(e) => setStudyTopic(e.target.value)}
                   className="w-full appearance-none bg-white border border-stone-300 text-stone-700 font-medium text-sm rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm cursor-pointer"
                >
                   <option value="" disabled>{t.selectTopic}</option>
                   {SYLLABUS_TOPICS.map((topic, i) => (
                      <option key={i} value={topic}>{topic}</option>
                   ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 text-stone-500 pointer-events-none" />
             </div>
             
             <button onClick={() => sendAutomatedMessage(t.startLesson)} disabled={!userId || isLoading || isPlaying || !isTtsReady} className="flex items-center justify-center gap-2 text-sm font-bold text-white transition-colors bg-amber-600 px-5 py-2.5 rounded-xl shadow-md hover:bg-amber-700 disabled:opacity-50 w-full sm:w-auto">
               <PlayCircle size={18} className="text-white"/> {t.startLesson}
             </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 scroll-smooth flex justify-center relative">
        
        {!isTtsReady && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-100 text-amber-800 border border-amber-300 px-5 py-2.5 rounded-full shadow-lg flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-4 font-sans whitespace-nowrap">
            <Loader2 size={18} className="animate-spin text-amber-600" /> 
            {t.wakingUp}
          </div>
        )}

        <div className="w-full max-w-3xl space-y-8 pb-4">
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 mt-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-stone-200 p-1 opacity-70"><img src="/dakini.png" alt="Tara" className="w-full h-full object-cover rounded-full" /></div>
              <p className="text-sm sm:text-base text-center max-w-md px-4 whitespace-pre-wrap font-sans">{t.selectMode}</p>
              
              {/* NEW BIG INTRO BUTTON */}
              <button 
                onClick={playWelcomeMessage} 
                disabled={!isTtsReady || isLoading || isPlaying}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold text-sm hover:bg-amber-200 transition shadow-sm disabled:opacity-50"
              >
                <PlayCircle size={18} className="text-amber-600" /> {t.playIntro}
              </button>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start w-full gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "user" ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 bg-stone-200 border border-stone-300 flex items-center justify-center"><span className="text-stone-500 font-bold text-base sm:text-lg font-sans">U</span></div>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    {msg.content.split(/([\u0F00-\u0FFF]+[^a-zA-Z0-9(（]*[(（][^)）]+[)）](?:\s*\{[^}]+\})?|[\u0F00-\u0FFF]+(?:[\s\u0F00-\u0FFF]*[\u0F00-\u0FFF]+)*)/g).map((part, i) => {
                      const trimmed = part.trim();
                      
                      if (!trimmed || /^[\.\?\!\,\;]+$/.test(trimmed)) return null;

                      const isTibetan = /[\u0F00-\u0FFF]/.test(trimmed);
                      const matchingAudio = msg.audioSequence?.find(a => a.text === part.trim())?.audio_base64;
                      const isThisPlaying = playingAudioBase64 === matchingAudio && matchingAudio != null;
                      const showSpinner = msg.isLoadingAudio && !matchingAudio;

                      let tibText = trimmed;
                      let phonetics = "";
                      let translation = "";
                      
                      if (isTibetan) {
                        const transMatch = trimmed.match(/\{([^}]+)\}/);
                        if (transMatch) {
                          translation = transMatch[1].trim();
                          tibText = trimmed.replace(transMatch[0], '').trim();
                        }

                        if (tibText.includes('(') || tibText.includes('（')) {
                          const splitIdx = tibText.lastIndexOf('(') !== -1 ? tibText.lastIndexOf('(') : tibText.lastIndexOf('（');
                          phonetics = tibText.substring(splitIdx + 1).replace(/[)）]/g, '').trim().toUpperCase();
                          tibText = tibText.substring(0, splitIdx).trim();
                        }
                      }

                      return (
                        <div key={i} data-active-part={isThisPlaying} className="flex flex-row items-start gap-3 sm:gap-4 w-full scroll-mt-24">
                          <div className="relative mt-1">
                            <button 
                              onClick={() => matchingAudio && replayAudio(matchingAudio, isTibetan)}
                              disabled={!matchingAudio && !showSpinner}
                              className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300 ${isThisPlaying ? (isTibetan ? 'ring-4 ring-red-700 scale-110 shadow-lg' : 'ring-4 ring-amber-500 scale-110 shadow-lg') : 'border border-stone-200 shadow-sm'} ${matchingAudio ? (isTibetan ? 'hover:border-red-700 cursor-pointer' : 'hover:border-amber-500 cursor-pointer') : 'cursor-default'}`}
                            >
                              <img src={isTibetan ? "/yogi.png" : "/dakini.png"} alt="Avatar" className={`w-full h-full object-cover ${isThisPlaying ? 'animate-pulse' : ''} ${showSpinner ? 'opacity-40 grayscale' : ''}`} />
                            </button>
                            {showSpinner && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Loader2 className="w-5 h-5 animate-spin text-stone-700" /></div>
                            )}
                          </div>
                          
                          <div className={`px-4 sm:px-6 rounded-2xl shadow-sm rounded-tl-none w-fit max-w-[85%] sm:max-w-[80%] ${isTibetan ? 'py-3 sm:py-4 bg-[#f8f6f0] border border-[#e8e4d9]' : 'py-3 sm:py-5 bg-white border border-stone-200 text-stone-800'}`}>
                            {isTibetan ? (
                              <div className="flex flex-col gap-2 items-start text-left w-full">
                                <span className="text-xl sm:text-3xl text-stone-800 leading-normal font-medium">{tibText}</span>
                                
                                {phonetics && (
                                  <span className="text-[11px] sm:text-[13px] text-stone-600 font-bold tracking-[0.1em] uppercase font-sans">
                                    {phonetics}
                                  </span>
                                )}
                                
                                {translation && (
                                  <span className="text-[13px] sm:text-sm text-stone-600 font-medium italic mt-1 border-t border-amber-200/50 pt-2 w-full font-sans">
                                    {translation}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap text-sm sm:text-[17px] leading-relaxed">{trimmed}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {msg.role === "user" && (
                  <div className={`w-full max-w-[85%] sm:max-w-[75%]`}>
                    <div className="p-3 sm:p-5 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed bg-amber-600 text-white rounded-br-none w-fit ml-auto whitespace-pre-wrap font-sans"><p>{msg.content}</p></div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && !isPlaying && (
            <div className="flex items-center gap-3 text-stone-500 p-2 ml-14 sm:ml-16 font-sans"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">{t.thinking}</span></div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0 relative z-20 pb-safe flex flex-col items-center font-sans">
        
        <div className="w-full max-w-3xl mb-3 flex justify-center items-center gap-3 sm:gap-4">
          <span className="text-[13px] sm:text-sm font-bold text-stone-500 whitespace-nowrap">{t.letTaraLead}</span>
          
          <div className="relative inline-flex group">
            {userId && !isLoading && !isRecording && !isPlaying && isTtsReady && (
              <span className="absolute -inset-1.5 rounded-full bg-amber-400 animate-pulse opacity-40 pointer-events-none blur-sm"></span>
            )}
            
            <button 
              type="button" 
              onClick={() => {
                if (messages.length === 0) sendAutomatedMessage(t.start);
                else sendAutomatedMessage(t.continue);
              }} 
              disabled={!userId || isLoading || isRecording || isPlaying || !isTtsReady} 
              className="relative z-10 px-6 sm:px-10 py-1.5 bg-amber-500 border-[3px] border-amber-600 text-white rounded-full shadow-md transition-all flex items-center justify-center hover:bg-amber-600 hover:scale-105 disabled:bg-stone-300 disabled:border-stone-400 disabled:text-stone-500 disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <svg width="40" height="24" viewBox="0 0 60 28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-2 sm:w-[50px] sm:h-[28px]">
                <line x1="2" y1="14" x2="56" y2="14" />
                <polyline points="46 4 56 14 46 24" />
              </svg>
            </button>
          </div>
          
          <span className="text-[13px] sm:text-sm font-bold text-stone-500 whitespace-nowrap">{t.or}</span>
        </div>

        <form onSubmit={handleSendTextForm} className="flex items-end gap-2 sm:gap-3 w-full max-w-3xl mx-auto relative">
          
          <button type="button" onClick={isRecording ? stopRecording : startRecording} disabled={!userId || isLoading || isPlaying || !isTtsReady} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors flex-shrink-0 relative mb-1 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-stone-800 hover:bg-stone-700"} disabled:opacity-50`}>
            {isRecording && <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50 pointer-events-none"></span>}
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center z-10">{isRecording ? <Square size={18} className="fill-white text-white" /> : <Mic size={18} className="text-white" />}</div>
          </button>
          
          <textarea 
             ref={textareaRef}
             rows={1}
             value={inputText} 
             onChange={(e) => setInputText(e.target.value)} 
             onKeyDown={handleKeyDown}
             disabled={!userId || isLoading || isRecording || isPlaying || !isTtsReady} 
             placeholder={!isTtsReady ? t.wakingUp : (!userId ? t.loginToChat : (isRecording ? t.listening : t.typePlaceholder))} 
             className="flex-1 min-w-0 bg-stone-100 border border-stone-200 rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3.5 text-[16px] text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-60 resize-none overflow-y-auto custom-scrollbar" 
             style={{ minHeight: '44px', maxHeight: '150px' }}
          />
          
          <button type="submit" disabled={!userId || !inputText.trim() || isLoading || isPlaying || !isTtsReady} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-amber-600 text-white rounded-full hover:bg-amber-700 disabled:opacity-50 transition-colors flex-shrink-0 mb-1"><Send size={18} className="ml-0.5 sm:ml-1" /></button>
          
          <button type="button" onClick={handleInterrupt} disabled={!(isLoading || isPlaying)} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 transition-colors flex-shrink-0 mb-1" title="Interrupt Tara">
            <StopCircle size={20} />
          </button>

        </form>
      </div>
    </main>
  );
}