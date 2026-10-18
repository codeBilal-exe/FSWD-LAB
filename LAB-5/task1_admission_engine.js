'use strict';

const SUPPORTED_PROGRAMS = ['BSCS', 'BSSE', 'BSAI', 'BSIT', 'BSEE'];
const MERIT_WEIGHTS = {
  matric: 0.20,
  intermediate: 0.30,
  entryTest: 0.50,
};
function toNumber(value, fieldName) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return {value: null, error: `${fieldName} is missing or empty`};
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return {
      value: null,
      error: `${fieldName} is not a valid number (got: "${value}")`
    };
  }
  return {value: num, error: null};
}
function toBoolean(value) {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return null;
}
function inRange(num, min, max) {
  return num >= min && num <= max;
}
function sanitizeApplicant(applicant) {
  const errors = [];
  const ageResult = toNumber(applicant.age, 'age');
  const matricResult = toNumber(applicant.matricMarks, 'matricMarks');
  const interResult =
      toNumber(applicant.intermediateMarks, 'intermediateMarks');
  const entryResult = toNumber(applicant.entryTest, 'entryTest');
  const feePaid = toBoolean(applicant.feePaid);
  if (ageResult.error) errors.push(ageResult.error);
  if (matricResult.error) errors.push(matricResult.error);
  if (interResult.error) errors.push(interResult.error);
  if (entryResult.error) errors.push(entryResult.error);
  if (ageResult.value !== null && !inRange(ageResult.value, 17, 30)) {
    errors.push(`age ${ageResult.value} is out of range (17-30)`);
  }
  if (matricResult.value !== null && !inRange(matricResult.value, 0, 100)) {
    errors.push(`matricMarks ${matricResult.value} out of range (0-100)`);
  }
  if (interResult.value !== null && !inRange(interResult.value, 0, 100)) {
    errors.push(`intermediateMarks ${interResult.value} out of range (0-100)`);
  }
  if (entryResult.value !== null && !inRange(entryResult.value, 0, 100)) {
    errors.push(`entryTest ${entryResult.value} out of range (0-100)`);
  }
  if (!SUPPORTED_PROGRAMS.includes(applicant.program)) {
    errors.push(`program "${applicant.program}" is not supported`);
  }
  return {
    id: applicant.id,
    name: String(applicant.name || '').trim(),
    age: ageResult.value,
    matricMarks: matricResult.value,
    intermediateMarks: interResult.value,
    entryTest: entryResult.value,
    program: applicant.program,
    feePaid,
    errors,
    isValid: errors.length === 0,
  };
}
function calculateMerit(matric, intermediate, entryTest) {
  return (
      matric * MERIT_WEIGHTS.matric +
      intermediate * MERIT_WEIGHTS.intermediate +
      entryTest * MERIT_WEIGHTS.entryTest);
}
function determineStatus(sanitized) {
  if (!sanitized.isValid) return 'INVALID DATA';
  const {matricMarks, intermediateMarks, entryTest} = sanitized;
  const merit = calculateMerit(matricMarks, intermediateMarks, entryTest);
  const isEligible = merit >= 70 && entryTest >= 60 && intermediateMarks >= 60;
  if (!isEligible) return 'REJECTED';
  if (merit >= 85) return 'SELECTED';
  return 'WAITING';
}
function processApplicant(applicant) {
  const sanitized = sanitizeApplicant(applicant);
  const status = determineStatus(sanitized);
  let merit = null;
  if (sanitized.isValid) {
    merit = parseFloat(calculateMerit(
                           sanitized.matricMarks, sanitized.intermediateMarks,
                           sanitized.entryTest)
                           .toFixed(2));
  }
  return {...sanitized, merit, status};
}
function generateSummary(processed) {
  const valid = processed.filter(a => a.isValid);
  const invalid = processed.filter(a => !a.isValid);
  const validWithMerit = valid.filter(a => a.merit !== null);
  const highestMerit = validWithMerit.reduce(
      (best, curr) => (curr.merit > (best?.merit ?? -Infinity) ? curr : best),
      null);
  const lowestMerit = validWithMerit.reduce(
      (worst, curr) => (curr.merit < (worst?.merit ?? Infinity) ? curr : worst),
      null);
  const averageMerit = validWithMerit.length > 0 ?
      parseFloat((validWithMerit.reduce((sum, a) => sum + a.merit, 0) /
                  validWithMerit.length)
                     .toFixed(2)) :
      null;
  const programCounts = {};
  for (const applicant of processed) {
    const prog = applicant.program ?? 'UNKNOWN';
    programCounts[prog] = (programCounts[prog] ?? 0) + 1;
  }
  return {
    totalApplicants: processed.length,
    validApplicants: valid.length,
    invalidApplicants: invalid.length,
    highestMeritApplicant: highestMerit ? {
      id: highestMerit.id,
      name: highestMerit.name,
      merit: highestMerit.merit
    } :
                                          null,
    lowestMeritAmongValid: lowestMerit ?
        {id: lowestMerit.id, name: lowestMerit.name, merit: lowestMerit.merit} :
        null,
    averageMerit,
    programCounts,
  };
}
const applicants = [
  {
    id: 'A101',
    name: 'Sara Khan',
    age: '19',
    matricMarks: '91',
    intermediateMarks: '87',
    entryTest: '78',
    program: 'BSCS',
    feePaid: 'true'
  },
  {
    id: 'A102',
    name: 'Ahmed Ali',
    age: 'twenty',
    matricMarks: '88',
    intermediateMarks: '',
    entryTest: '72',
    program: 'BSSE',
    feePaid: 'false'
  },
  {
    id: 'A103',
    name: 'Hassan',
    age: '18',
    matricMarks: '76',
    intermediateMarks: '83',
    entryTest: '91',
    program: 'BSAI',
    feePaid: 'true'
  },
  {
    id: 'A104',
    name: 'Zara',
    age: '17',
    matricMarks: '100',
    intermediateMarks: '100',
    entryTest: '100',
    program: 'BSCS',
    feePaid: 'true'
  },
  {
    id: 'A105',
    name: 'Omar',
    age: '30',
    matricMarks: '50',
    intermediateMarks: '50',
    entryTest: '50',
    program: 'BSIT',
    feePaid: 'true'
  },
  {
    id: 'A106',
    name: 'Layla',
    age: '21',
    matricMarks: '80',
    intermediateMarks: '75',
    entryTest: '88',
    program: 'MBBS',
    feePaid: 'true'
  },
  {
    id: 'A107',
    name: 'Bilal',
    age: '31',
    matricMarks: '90',
    intermediateMarks: '88',
    entryTest: '95',
    program: 'BSCS',
    feePaid: 'true'
  },
];
const processed = applicants.map(processApplicant);
console.log('=== CampusFlow: Admission Decision Engine ===\n');
for (const a of processed) {
  console.log(`[${a.id}] ${a.name}`);
  console.log(`  Status : ${a.status}`);
  if (a.merit !== null) console.log(`  Merit  : ${a.merit}`);
  if (a.errors.length > 0) console.log(`  Errors : ${a.errors.join(' | ')}`);
  console.log();
}
const summary = generateSummary(processed);
console.log('=== Admission Summary ===');
console.log(`Total Applicants  : ${summary.totalApplicants}`);
console.log(`Valid Applicants  : ${summary.validApplicants}`);
console.log(`Invalid Applicants: ${summary.invalidApplicants}`);
console.log(`Highest Merit     :`, summary.highestMeritApplicant);
console.log(`Lowest Merit      :`, summary.lowestMeritAmongValid);
console.log(`Average Merit     : ${summary.averageMerit}`);
console.log('Program Counts    :', summary.programCounts);
