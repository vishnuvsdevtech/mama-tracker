/*
 * Week-by-week guidance, built only from published clinical guidelines and peer-reviewed research.
 * Every item lists the sources it rests on; every source has a public link.
 * Weeks are weeks of pregnancy counted from the first day of the last period (as doctors count them).
 *
 * Rules we follow:
 *  - no item without at least one source below
 *  - where countries differ (e.g. vaccine timing), we say so instead of picking one silently
 *  - India-specific programme advice is tagged `india`
 *  - we never give diagnoses, targets or "normal ranges" for her own numbers
 */

export type SourceKind = 'guideline' | 'india' | 'research'
export interface Source { id: string; short: string; title: string; org: string; year: string; url: string; kind: SourceKind }

export const SOURCES: Source[] = [
  // international clinical guidelines
  { id: 'who-anc', short: 'WHO 2016', kind: 'guideline', org: 'World Health Organization', year: '2016',
    title: 'WHO recommendations on antenatal care for a positive pregnancy experience', url: 'https://www.ncbi.nlm.nih.gov/books/NBK409099/' },
  { id: 'who-pa', short: 'WHO 2020', kind: 'guideline', org: 'World Health Organization (Br J Sports Med)', year: '2020',
    title: 'WHO 2020 guidelines on physical activity and sedentary behaviour', url: 'https://doi.org/10.1136/bjsports-2020-102955' },
  { id: 'who-pmh', short: 'WHO 2022', kind: 'guideline', org: 'World Health Organization', year: '2022',
    title: 'Guide for integration of perinatal mental health in maternal and child health services', url: 'https://who.int/news/item/19-09-2022-launch-of-the-who-guide-for-integration-of-perinatal-mental-health' },
  { id: 'nice-anc', short: 'NICE NG201', kind: 'guideline', org: 'NICE (UK)', year: '2021',
    title: 'Antenatal care — NICE guideline NG201', url: 'https://www.nice.org.uk/guidance/ng201' },
  { id: 'nice-sched', short: 'NICE schedule', kind: 'guideline', org: 'NICE (UK)', year: '2021',
    title: 'Schedule of antenatal appointments (NG201)', url: 'https://www.nice.org.uk/guidance/ng201/resources/schedule-of-antenatal-appointments-pdf-9204300829' },
  { id: 'nice-mh', short: 'NICE CG192', kind: 'guideline', org: 'NICE (UK)', year: '2014, updated 2020',
    title: 'Antenatal and postnatal mental health — NICE guideline CG192', url: 'https://www.nice.org.uk/guidance/cg192' },
  { id: 'nhs-vit', short: 'NHS · supplements', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Pregnancy vitamins and supplements', url: 'https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/' },
  { id: 'nhs-food', short: 'NHS · food', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Foods to avoid in pregnancy', url: 'https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/' },
  { id: 'nhs-health', short: 'NHS · healthy habits', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Health things you should know in pregnancy', url: 'https://www.nhs.uk/pregnancy/finding-out/health-things-you-should-know-in-pregnancy/' },
  { id: 'nhs-screen', short: 'NHS · screening', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Screening tests in pregnancy', url: 'https://www.nhs.uk/pregnancy/your-pregnancy-care/screening-tests/' },
  { id: 'nhs-appts', short: 'NHS · appointments', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Your antenatal appointments', url: 'https://www.nhs.uk/pregnancy/your-pregnancy-care/your-antenatal-appointments/' },
  { id: 'nhs-still', short: 'NHS · stillbirth', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Reducing the risk of stillbirth (sleep position, baby\'s movements, when to get help)', url: 'https://www.nhs.uk/pregnancy/keeping-well/reducing-the-risk-of-stillbirth/' },
  { id: 'nhs-pe', short: 'NHS · pre-eclampsia', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Pre-eclampsia', url: 'https://www.nhs.uk/conditions/pre-eclampsia/' },
  { id: 'nhs-vacc', short: 'NHS · vaccines', kind: 'guideline', org: 'NHS (UK)', year: 'current',
    title: 'Vaccinations in pregnancy', url: 'https://www.nhs.uk/pregnancy/keeping-well/vaccinations/' },
  { id: 'nhs-weeks', short: 'NHS · week by week', kind: 'guideline', org: 'NHS (UK) — Best Start in Life', year: 'current',
    title: 'Week-by-week guide to pregnancy', url: 'https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/' },
  { id: 'acog-food', short: 'ACOG · nutrition', kind: 'guideline', org: 'American College of Obstetricians and Gynecologists', year: 'current',
    title: 'Nutrition during pregnancy', url: 'https://www.acog.org/en/Womens%20Health/FAQs/Nutrition%20During%20Pregnancy' },
  { id: 'acog-vacc', short: 'ACOG · vaccines', kind: 'guideline', org: 'American College of Obstetricians and Gynecologists', year: 'current',
    title: 'Vaccine safety during pregnancy', url: 'https://www.acog.org/womens-health/faqs/vaccine-safety-during-pregnancy' },
  { id: 'acog-gbs', short: 'ACOG · GBS', kind: 'guideline', org: 'American College of Obstetricians and Gynecologists', year: '2020, reaffirmed 2025',
    title: 'Group B strep and pregnancy (Committee Opinion 797)', url: 'https://www.acog.org/womens-health/faqs/group-b-strep-and-pregnancy' },
  { id: 'cdc-vacc', short: 'CDC', kind: 'guideline', org: 'US Centers for Disease Control and Prevention', year: 'current',
    title: 'Guidelines for vaccinating pregnant women', url: 'https://www.cdc.gov/vaccines-pregnancy/hcp/vaccination-guidelines/index.html' },
  { id: 'fda-fish', short: 'FDA/EPA', kind: 'guideline', org: 'US Food and Drug Administration & EPA', year: '2021',
    title: 'Advice about eating fish (pregnancy and breastfeeding)', url: 'https://www.fda.gov/food/consumers/advice-about-eating-fish' },

  // India
  { id: 'in-amb', short: 'MoHFW · Anemia Mukt Bharat', kind: 'india', org: 'Ministry of Health & Family Welfare, Govt. of India', year: '2025',
    title: 'Anemia Mukt Bharat — IFA for 180 days and deworming in pregnancy (PIB update)', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2117215' },
  { id: 'in-calcium', short: 'MoHFW · calcium', kind: 'india', org: 'Ministry of Health & Family Welfare, Govt. of India', year: '2014',
    title: 'National guidelines for calcium supplementation during pregnancy and lactation', url: 'https://www.iapsm.org/pdf/Guidelines/RMNCH+A/Guidelines%20for%20Calcium%20Supplementation%20During%20Pregnancy%20and%20Lactation%202014.pdf' },
  { id: 'in-deworm', short: 'MoHFW · deworming', kind: 'india', org: 'Ministry of Health & Family Welfare, Govt. of India', year: '2014',
    title: 'National guidelines for deworming in pregnancy', url: 'https://www.iapsm.org/pdf/Guidelines/RMNCH+A/Guidelines%20for%20Deworming%20in%20Pregnancy%202014.pdf' },
  { id: 'in-gdm', short: 'MoHFW · GDM', kind: 'india', org: 'Ministry of Health & Family Welfare, Govt. of India', year: '2018',
    title: 'Diagnosis & management of gestational diabetes mellitus — technical and operational guidelines', url: 'https://nhm.gov.in/New_Updates_2018/NHM_Components/RMNCH_MH_Guidelines/Gestational-Diabetes-Mellitus.pdf' },
  { id: 'in-td', short: 'MoHFW · Td', kind: 'india', org: 'Ministry of Health & Family Welfare, Govt. of India', year: '2018',
    title: 'Td vaccine operational guidelines (Td replaces TT for pregnant women)', url: 'https://nhm.gov.in/New_Updates_2018/NHM_Components/Immunization/Guildelines_for_immunization/Td_vaccine_operational_guidelines.pdf' },
  { id: 'in-pmsma', short: 'PMSMA', kind: 'india', org: 'Ministry of Health & Family Welfare, Govt. of India', year: '2016–',
    title: 'Pradhan Mantri Surakshit Matritva Abhiyan — free antenatal check-up on the 9th of every month', url: 'https://pmsma.mohfw.gov.in/' },
  { id: 'in-pcpndt', short: 'PCPNDT Act', kind: 'india', org: 'Government of India', year: '1994, amended 2003',
    title: 'Pre-Conception and Pre-Natal Diagnostic Techniques (Prohibition of Sex Selection) Act', url: 'https://www.indiacode.nic.in/handle/123456789/1937' },
  { id: 'in-fogsi', short: 'FOGSI', kind: 'india', org: 'Federation of Obstetric & Gynaecological Societies of India', year: 'position statement',
    title: 'Vaccination in pregnant Indian women', url: 'https://www.fogsi.org/wp-content/uploads/2026/05/Fogsi-Vaccination-In-Pregnancy.pdf' },

  // peer-reviewed research
  { id: 'r-folic', short: 'Cochrane 2015', kind: 'research', org: 'Cochrane Database of Systematic Reviews', year: '2015',
    title: 'De-Regil LM et al. Effects and safety of periconceptional oral folate supplementation for preventing birth defects', url: 'https://doi.org/10.1002/14651858.CD007950.pub3' },
  { id: 'r-iron', short: 'Cochrane 2015', kind: 'research', org: 'Cochrane Database of Systematic Reviews', year: '2015',
    title: 'Peña-Rosas JP et al. Daily oral iron supplementation during pregnancy', url: 'https://doi.org/10.1002/14651858.CD004736.pub5' },
  { id: 'r-calcium', short: 'Cochrane 2018', kind: 'research', org: 'Cochrane Database of Systematic Reviews', year: '2018',
    title: 'Hofmeyr GJ et al. Calcium supplementation during pregnancy for preventing hypertensive disorders', url: 'https://doi.org/10.1002/14651858.CD001059.pub5' },
  { id: 'r-us', short: 'Cochrane 2015', kind: 'research', org: 'Cochrane Database of Systematic Reviews', year: '2015',
    title: 'Whitworth M et al. Ultrasound for fetal assessment in early pregnancy', url: 'https://doi.org/10.1002/14651858.CD007058.pub3' },
  { id: 'r-aspirin', short: 'NEJM 2017', kind: 'research', org: 'New England Journal of Medicine', year: '2017',
    title: 'Rolnik DL et al. Aspirin versus placebo in pregnancies at high risk for preterm preeclampsia (ASPRE trial)', url: 'https://doi.org/10.1056/NEJMoa1704559' },
  { id: 'r-hapo', short: 'NEJM 2008', kind: 'research', org: 'New England Journal of Medicine', year: '2008',
    title: 'HAPO Study Group. Hyperglycemia and adverse pregnancy outcomes', url: 'https://doi.org/10.1056/NEJMoa0707943' },
  { id: 'r-sleep', short: 'eClinicalMedicine 2019', kind: 'research', org: 'eClinicalMedicine (The Lancet)', year: '2019',
    title: 'Cronin RS et al. Maternal going-to-sleep position and the risk of late stillbirth: individual participant data meta-analysis', url: 'https://doi.org/10.1016/j.eclinm.2019.03.014' },
  { id: 'r-pertussis', short: 'Lancet 2014', kind: 'research', org: 'The Lancet', year: '2014',
    title: 'Amirthalingam G et al. Effectiveness of maternal pertussis vaccination in England', url: 'https://doi.org/10.1016/S0140-6736(14)60686-3' },
  { id: 'r-caffeine', short: 'BMJ 2008', kind: 'research', org: 'BMJ', year: '2008',
    title: 'CARE Study Group. Maternal caffeine intake during pregnancy and risk of fetal growth restriction', url: 'https://doi.org/10.1136/bmj.a2332' },
]
export const SOURCE: Record<string, Source> = Object.fromEntries(SOURCES.map(s => [s.id, s]))

export type Kind = 'check' | 'supplement' | 'vaccine' | 'food' | 'body' | 'mind' | 'watch'
export const KINDS: Record<Kind, { label: string; icon: string }> = {
  check: { label: 'Check-ups, tests & scans', icon: '🩺' },
  supplement: { label: 'Supplements', icon: '💊' },
  vaccine: { label: 'Vaccines', icon: '💉' },
  food: { label: 'Food & drink', icon: '🥗' },
  body: { label: 'Moving & resting', icon: '🧘' },
  mind: { label: 'How you feel', icon: '💗' },
  watch: { label: 'Call your doctor straight away if…', icon: '🚨' },
}

export interface Advice {
  id: string
  from: number
  to: number
  kind: Kind
  title: string
  text: string
  src: string[]
  india?: boolean
  /** a short window that is "due" now rather than ongoing */
  due?: boolean
  link?: { to: string; label: string }
}

/** WHO's 8-contact model: first contact by 12 weeks, then 20, 26, 30, 34, 36, 38, 40 */
const WHO_CONTACTS = [20, 26, 30, 34, 36, 38, 40]

export const ADVICE: Advice[] = [
  /* ---------- first weeks ---------- */
  { id: 'folic', from: 4, to: 12, kind: 'supplement', title: 'Folic acid every day until 12 weeks',
    text: '400 micrograms a day lowers the chance of neural tube defects such as spina bifida. Some women are prescribed a higher dose — your doctor will say if that\'s you.',
    src: ['nhs-vit', 'who-anc', 'r-folic'] },
  { id: 'booking', from: 4, to: 12, kind: 'check', due: true, title: 'Book your first antenatal visit',
    text: 'WHO advises the first contact before 12 weeks; NICE suggests booking by 10 weeks. First bloods usually include blood group and Rh type, haemoglobin, and tests for HIV, syphilis and hepatitis B.',
    src: ['who-anc', 'nice-anc', 'nice-sched'] },
  { id: 'gdm1', from: 4, to: 16, kind: 'check', india: true, title: 'Sugar test at your first visit',
    text: 'India\'s guideline: a 75 g glucose test (OGTT) at the first antenatal visit — no fasting needed, one blood check 2 hours later. If normal, it\'s repeated at 24–28 weeks.',
    src: ['in-gdm', 'r-hapo'] },
  { id: 'nausea', from: 5, to: 14, kind: 'body', title: 'Nausea is common early on',
    text: 'Small, frequent meals and plenty of fluids can help. If you can\'t keep food or fluids down, contact your doctor — it can be treated.',
    src: ['nice-anc'] },
  { id: 'nt', from: 11, to: 14, kind: 'check', due: true, title: 'First-trimester (dating / NT) scan',
    text: 'Usually done between about 11 and 14 weeks. It confirms your dates and the number of babies, and can be combined with a blood test to screen for Down\'s, Edwards\' and Patau\'s syndromes. Screening is your choice.',
    src: ['nhs-screen', 'nice-anc', 'r-us'] },
  { id: 'aspirin', from: 11, to: 16, kind: 'check', title: 'Ask about your pre-eclampsia risk',
    text: 'If you have risk factors (for example high blood pressure, diabetes or pre-eclampsia before), doctors may prescribe low-dose aspirin from about 12 weeks. A large trial showed it lowers preterm pre-eclampsia. Only take it if prescribed.',
    src: ['r-aspirin', 'nhs-pe'] },

  /* ---------- every week ---------- */
  { id: 'nosmoke', from: 4, to: 42, kind: 'food', title: 'No alcohol, no smoking',
    text: 'There is no known safe amount of alcohol in pregnancy, and stopping smoking at any point helps your baby. Ask for free support to quit.',
    src: ['nhs-health', 'nhs-food', 'who-anc'] },
  { id: 'caffeine', from: 4, to: 42, kind: 'food', title: 'Keep caffeine under 200 mg a day',
    text: 'That\'s about two mugs of instant coffee — tea, cola, energy drinks and chocolate count too. Higher intakes are linked with lower birth weight.',
    src: ['nhs-food', 'r-caffeine', 'who-anc'] },
  { id: 'foodsafe', from: 4, to: 42, kind: 'food', title: 'Foods to avoid',
    text: 'Unpasteurised milk and soft cheeses made from it, raw or undercooked meat, eggs and seafood, liver, and high-mercury fish such as shark, swordfish and king mackerel. Paneer made with pasteurised milk is fine.',
    src: ['nhs-food', 'fda-fish', 'acog-food'] },
  { id: 'fish', from: 4, to: 42, kind: 'food', title: 'Do eat fish — the low-mercury kind',
    text: '2–3 servings a week of low-mercury fish (for example sardines, anchovies, salmon) supports your baby\'s brain development.',
    src: ['fda-fish', 'acog-food'] },
  { id: 'vitd', from: 4, to: 42, kind: 'supplement', title: 'Vitamin D — ask what applies to you',
    text: 'UK advice is 10 micrograms (400 IU) a day through pregnancy. WHO does not recommend it routinely for everyone. India\'s calcium tablets already contain some vitamin D. Ask your doctor.',
    src: ['nhs-vit', 'who-anc', 'in-calcium'] },
  { id: 'move', from: 4, to: 42, kind: 'body', title: 'Keep moving, gently',
    text: 'If your doctor hasn\'t advised otherwise, aim for at least 150 minutes a week of moderate activity — brisk walking counts — plus some gentle strengthening.',
    src: ['who-pa', 'who-anc'] },
  { id: 'mind', from: 4, to: 42, kind: 'mind', title: 'Your feelings count too',
    text: 'Almost 1 in 5 women have a mental health condition during pregnancy or the year after. Feeling low, anxious or not yourself for two weeks or more? Tell your doctor — it is common and treatable.',
    src: ['who-pmh', 'nice-mh'] },
  { id: 'urgent', from: 4, to: 42, kind: 'watch', title: 'Don\'t wait — call now if you have',
    text: 'Bleeding from the vagina, fluid leaking, stomach pain, unusual discharge, swelling with blurred vision or a severe headache, or itching (often worse at night, on hands and feet).',
    src: ['nhs-still'] },

  /* ---------- second trimester ---------- */
  { id: 'eat2', from: 14, to: 27, kind: 'food', title: 'A little extra food — not double',
    text: 'You need about 340 extra kcal a day in the second trimester — roughly one healthy snack. "Eat for two" isn\'t the advice; "eat twice as healthy" is.',
    src: ['acog-food'] },
  { id: 'ifa', from: 14, to: 42, kind: 'supplement', india: true, title: 'Iron + folic acid tablet daily (from the 4th month)',
    text: 'India\'s programme gives one red IFA tablet (60 mg iron + 500 µg folic acid) daily for 180 days in pregnancy, continuing after birth. Take it about 2 hours after a meal, and not together with your calcium tablet.',
    src: ['in-amb', 'in-calcium', 'who-anc', 'r-iron'] },
  { id: 'calcium', from: 14, to: 42, kind: 'supplement', india: true, title: 'Calcium twice a day (from 14 weeks)',
    text: '500 mg with one meal and 500 mg with another (1 g a day), continuing for 6 months after birth. Don\'t take both together or with iron. Calcium lowers the risk of pre-eclampsia.',
    src: ['in-calcium', 'r-calcium', 'who-anc'] },
  { id: 'deworm', from: 14, to: 27, kind: 'supplement', india: true, due: true, title: 'One deworming tablet this trimester',
    text: 'A single albendazole tablet is given in the second trimester, not in the first.',
    src: ['in-deworm', 'in-amb'] },
  { id: 'td', from: 12, to: 24, kind: 'vaccine', india: true, due: true, title: 'Td (tetanus–diphtheria) vaccine',
    text: 'India: first dose early in pregnancy, second dose 4 weeks later (or one booster if you had two doses in a pregnancy within the last 3 years). FOGSI suggests starting at or after 12 weeks.',
    src: ['in-td', 'in-fogsi', 'who-anc'] },
  { id: 'flu', from: 12, to: 42, kind: 'vaccine', title: 'Flu vaccine is safe in pregnancy',
    text: 'The inactivated flu shot can be given in any trimester; FOGSI suggests from 12 weeks. Flu is more serious in pregnancy, and the vaccine also protects your newborn.',
    src: ['acog-vacc', 'cdc-vacc', 'in-fogsi'] },
  { id: 'pmsma', from: 14, to: 40, kind: 'check', india: true, title: 'Free check-up on the 9th of every month',
    text: 'Under PMSMA, government health facilities offer a free specialist antenatal check-up on the 9th of each month in the second and third trimesters.',
    src: ['in-pmsma'] },
  { id: 'feel', from: 16, to: 24, kind: 'body', title: 'First movements',
    text: 'Most women first feel their baby move between 16 and 24 weeks. If you haven\'t felt any movement by 24 weeks, tell your doctor.',
    src: ['nhs-still', 'nhs-appts'] },
  { id: 'anomaly', from: 18, to: 21, kind: 'check', due: true, title: 'Anomaly (mid-pregnancy) scan',
    text: 'Done between 18 and 20 weeks + 6 days. It checks how your baby is developing — heart, brain, spine, face, kidneys and tummy. In India, the PCPNDT Act forbids telling anyone the baby\'s sex.',
    src: ['nhs-screen', 'who-anc', 'in-pcpndt'] },
  { id: 'pe', from: 20, to: 42, kind: 'watch', title: 'Signs of pre-eclampsia',
    text: 'A severe headache, blurred vision or flashing lights, pain just below the ribs, being sick, or sudden swelling of your face, hands or feet.',
    src: ['nhs-pe'] },
  { id: 'gdm2', from: 24, to: 28, kind: 'check', due: true, title: 'Glucose test for gestational diabetes',
    text: 'A 75 g OGTT between 24 and 28 weeks checks for gestational diabetes (in India, repeated if your first-visit test was normal). Raised blood sugar in pregnancy is linked with bigger babies and birth complications.',
    src: ['in-gdm', 'r-hapo', 'nice-anc'] },
  { id: 'move24', from: 24, to: 42, kind: 'watch', title: 'Movements slowed, changed or stopped',
    text: 'Get to know your baby\'s own pattern. If it changes, call your hospital the same day — don\'t wait until tomorrow. Babies do not move less towards the end of pregnancy.',
    src: ['nhs-still'], link: { to: '/tools/kicks', label: 'Open the kick counter' } },

  /* ---------- third trimester ---------- */
  { id: 'eat3', from: 28, to: 42, kind: 'food', title: 'A bit more food now',
    text: 'About 450 extra kcal a day in the third trimester — still not "eating for two".',
    src: ['acog-food'] },
  { id: 'hb28', from: 26, to: 29, kind: 'check', due: true, title: '28-week bloods',
    text: 'Haemoglobin is usually re-checked around 28 weeks. If your blood group is Rh-negative, you\'ll be offered anti-D.',
    src: ['nice-sched', 'nhs-appts'] },
  { id: 'sleep', from: 28, to: 42, kind: 'body', title: 'Go to sleep on your side',
    text: 'From 28 weeks, settle to sleep on your left or right side. Going to sleep on your back is linked with a higher risk of stillbirth. Woke up on your back? Just turn over.',
    src: ['nhs-still', 'r-sleep'] },
  { id: 'tdap', from: 27, to: 36, kind: 'vaccine', due: true, title: 'Whooping cough (Tdap) vaccine',
    text: 'Best between 27 and 36 weeks, in every pregnancy — your antibodies protect your baby in the first months. FOGSI suggests it in place of the second Td dose. (UK offers it from 16 weeks.)',
    src: ['cdc-vacc', 'acog-vacc', 'in-fogsi', 'r-pertussis', 'nhs-vacc'] },
  { id: 'rsv', from: 28, to: 36, kind: 'vaccine', title: 'RSV vaccine — ask if it\'s offered',
    text: 'Some countries offer it in the third trimester to protect newborns (UK from 28 weeks; US at 32–36 weeks in RSV season). Ask your doctor whether it\'s available to you.',
    src: ['nhs-vacc', 'cdc-vacc', 'in-fogsi'] },
  { id: 'gbs', from: 35, to: 38, kind: 'check', title: 'Group B strep swab (some countries)',
    text: 'In the US, a swab at 36–37 weeks is routine; in the UK and India it isn\'t routine everywhere. Ask whether your hospital does it.',
    src: ['acog-gbs'] },
  { id: 'labourplan', from: 35, to: 42, kind: 'check', title: 'Know when to go in',
    text: 'At your 36-week visit, ask when to come to hospital once contractions start or your waters break, and note your doctor\'s rule in the contraction timer.',
    src: ['nice-sched'], link: { to: '/tools/contractions', label: 'Open the contraction timer' } },

  /* ---------- WHO contact schedule ---------- */
  ...WHO_CONTACTS.map((w): Advice => ({
    id: `who-${w}`, from: w - 1, to: w, kind: 'check', due: true,
    title: `Routine check-up around week ${w}`,
    text: 'Part of WHO\'s 8-contact schedule (first by 12 weeks, then 20, 26, 30, 34, 36, 38 and 40 weeks): a check on you and your baby, and time for your questions.',
    src: ['who-anc'], link: { to: '/tools/visits', label: 'Add it to your visits' },
  })),
]

export function adviceFor(week: number) {
  const w = Math.max(4, Math.min(42, Math.round(week)))
  const all = ADVICE.filter(a => w >= a.from && w <= a.to)
  // "now" = things that are due in a window, or that just started this week or last
  const now = all.filter(a => (a.due || a.from >= w - 1) && a.kind !== 'watch')
  const rest = all.filter(a => !now.includes(a))
  return { week: w, now, rest, all }
}
