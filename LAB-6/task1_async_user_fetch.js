'use strict';

function fakeApiCall(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 99) {
        reject(
            new Error(`Network error: could not reach API for user ${userId}`));
        return;
      }
      if (userId < 1 || userId > 10) {
        reject(new Error(`404: user ${userId} not found`));
        return;
      }
      resolve({
        id: userId,
        name: `User_${userId}`,
        email: `user${userId}@campus.edu`,
        role: userId % 2 === 0 ? 'student' : 'faculty'
      });
    }, 300);
  });
}
function isValidUser(u) {
  return u && typeof u.id === 'number' && typeof u.name === 'string' &&
      u.name.trim() !== '' && typeof u.email === 'string' &&
      u.email.includes('@');
}
async function fetchUser(id) {
  const user = await fakeApiCall(id);
  if (!isValidUser(user)) throw new Error(`Invalid user data for id ${id}`);
  return user;
}
async function main() {
  const ids = [3, 7, 0, 99];
  for (const id of ids) {
    try {
      const u = await fetchUser(id);
      console.log('[SUCCESS]', u);
    } catch (e) {
      console.log('[ERROR]', e.message);
    }
  }
}
main();
