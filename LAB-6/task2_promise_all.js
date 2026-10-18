'use strict';

function fetchUserProfile(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 0) {
        reject(new Error(`Profile service: user ${userId} does not exist`));
        return;
      }
      resolve({
        id: userId,
        name: `User_${userId}`,
        email: `user${userId}@campus.edu`,
      });
    }, 300);
  });
}
function fetchUserAccount(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 0) {
        reject(new Error(`Account service: no account for user ${userId}`));
        return;
      }
      resolve({
        userId,
        credits: userId * 10,
        active: userId % 2 !== 0,
      });
    }, 200);
  });
}
function isValidProfile(profile) {
  return (
      profile && typeof profile.id === 'number' &&
      typeof profile.name === 'string' && profile.name.trim() !== '' &&
      typeof profile.email === 'string' && profile.email.includes('@'));
}
function isValidAccount(account) {
  return (
      account && typeof account.userId === 'number' &&
      typeof account.credits === 'number' &&
      typeof account.active === 'boolean');
}
async function fetchUserDetails(userId) {
  const [profile, account] = await Promise.all([
    fetchUserProfile(userId),
    fetchUserAccount(userId),
  ]);
  if (!isValidProfile(profile)) {
    throw new Error(`Invalid profile data for user ${userId}`);
  }
  if (!isValidAccount(account)) {
    throw new Error(`Invalid account data for user ${userId}`);
  }
  return {profile, account};
}
async function main() {
  const testCases = [5, 0];
  for (const id of testCases) {
    console.log(`\nFetching details for user id=${id}...`);
    try {
      const details = await fetchUserDetails(id);
      console.log('[SUCCESS] Profile :', details.profile);
      console.log('[SUCCESS] Account :', details.account);
    } catch (err) {
      console.log(`[REJECTED] Promise.all failed → ${err.message}`);
    }
  }
}
main();
