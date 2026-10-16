// Catalogo moduli E-BOOST (testi statici).
// Gli id devono restare allineati a backend/src/clients.ts (MODULE_IDS).
export const MODULES = [
  {
    id: 'performance-asset',
    name: 'Performance energetica e gestione asset avanzata',
    description:
      "Costruito sulla piattaforma E-BOOST, questo modulo sfrutta dati in tempo reale, algoritmi avanzati e la tecnologia Energy Twin per offrire una visibilità approfondita sulle prestazioni di sito e asset. Rilevando automaticamente le anomalie, monitorando i trend di efficienza e confrontando le prestazioni nel tempo e tra asset, aiuta energy manager e operatori ad agire prima che le inefficienze si trasformino in guasti, massimizzando l'operatività, ottimizzando l'uso dell'energia ed estendendo il ciclo di vita degli asset.",
    features: [
      'Analisi a livello di sito e asset',
      'Modellazione Energy Twin',
      'Rilevamento anomalie e identificazione guasti precoci',
      "Monitoraggio dell'efficienza nel tempo",
    ],
  },
  {
    id: 'regulatory-compliance',
    name: 'Conformità normativa avanzata',
    description:
      "Estende la piattaforma E-BOOST con potenti strumenti di conformità per soddisfare con sicurezza gli standard nazionali ed europei di gestione dell'energia. Il modulo semplifica la conformità raccogliendo e strutturando i dati energetici in linea con EN 16247 e ISO 50001. Automatizza le attività di rendicontazione critiche, dalle letture dei contatori di energia elettrica e gas per gli invii normativi al calcolo dell'impronta di carbonio di Scope 1 e 2. Con EnPI configurabili, audit trail trasparenti e generazione automatica dei report, semplifica i processi di certificazione, garantisce una documentazione tracciabile e pronta per gli audit e mantiene il sistema di gestione dell'energia costantemente allineato all'evoluzione delle normative.",
    features: [
      'Gestione dati pronta per gli adempimenti',
      'Generazione automatica dei report',
      'Tracciabilità (audit trail)',
      'Rendicontazione carbonio ed energia',
    ],
  },
  {
    id: 'energy-costs',
    name: 'Gestione energia e costi',
    description:
      "Questo modulo consente alle aziende di anticipare la domanda di energia, ottimizzare i costi ed evitare costosi picchi di carico. Combinando previsioni avanzate con la gestione automatizzata dei carichi, aiuta gli utenti a prendere decisioni informate e proattive che migliorano le prestazioni operative e finanziarie.",
    features: [
      'Previsione budget e pianificazione dei consumi',
      'Gestione dei picchi di carico',
    ],
  },
  {
    id: 'prosumers',
    name: 'Ottimizzazione energetica per prosumer',
    description:
      "E-BOOST permette ai prosumer di bilanciare in modo intelligente generazione, accumulo e consumo di energia. Coordinando le fonti rinnovabili on-site con i segnali di mercato e i programmi operativi, ottimizza l'autoconsumo, riduce i costi e migliora la sostenibilità. Il sistema abilita decisioni dinamiche per sfruttare appieno le risorse energetiche distribuite.",
    features: [
      'Integrazione della generazione da fonti rinnovabili',
      'Pianificazione dei consumi',
    ],
  },
  {
    id: 'asset-health',
    name: 'Monitoraggio avanzato di asset e stato di salute',
    description:
      "Questo modulo aumenta l'affidabilità degli asset combinando l'intelligenza energetica con dati multi-sensore e analisi predittive. Integrando i segnali di temperatura, pressione, vibrazione e altri parametri critici con l'Energy Digital Twin di E-BOOST, crea un profilo di salute completo di ogni asset. Algoritmi avanzati rilevano i guasti in fase iniziale, prevedono i malfunzionamenti prima che si verifichino e forniscono raccomandazioni di manutenzione mirate. Il risultato: meno fermi non pianificati, vita utile degli asset più lunga e costi di manutenzione ridotti.",
    features: ['Integrazione dati multi-sensore', 'Algoritmo di manutenzione predittiva'],
  },
  {
    id: 'bess',
    name: 'Ottimizzazione energetica per sistemi BESS',
    description:
      "Questa categoria di funzionalità abilita la gestione intelligente e automatizzata dei sistemi di accumulo a batteria (BESS) per massimizzare le prestazioni operative ed economiche. Combinando il monitoraggio degli asset in tempo reale, l'integrazione dei prezzi di mercato, allarmi intelligenti e strategie di controllo automatizzate, E-BOOST aiuta gli energy manager a ottimizzare l'uso dell'accumulo per arbitraggio, mercati della capacità e peak shaving.",
    features: [
      'Monitoraggio asset in tempo reale',
      'Dati di mercato integrati',
      'Allarmi intelligenti su soglia',
      'Automazione avanzata BESS',
    ],
  },
]
