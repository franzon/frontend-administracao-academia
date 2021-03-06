import {
  addDays, isAfter, parseISO,
} from 'date-fns';

export function putSubscribeData(matchId, {
  brokerTopic,
}) {
  localStorage.setItem(`match-token.subscribe-${matchId}`, JSON.stringify({
    brokerTopic,
    expirationDate: addDays(new Date(), 1),
  }));
}

export function clearExpiredTokens() {
  const invalidKeys = Object
    .entries(localStorage)
    .filter(([key]) => key.startsWith('match-token'))
    .filter(([key]) => {
      const matchData = localStorage.getItem(key);

      try {
        const parsedData = JSON.parse(matchData);

        return isAfter(new Date(), parseISO(parsedData.expirationDate));
      } catch (error) {
        return true;
      }
    });

  invalidKeys.forEach(([key]) => localStorage.removeItem(key));
}

export function putControlData(matchId, {
  publishToken,
  refreshToken,
  controllerSequence,
}) {
  localStorage.setItem(`match-token.control-${matchId}`, JSON.stringify({
    publishToken,
    refreshToken,
    controllerSequence,
    expirationDate: addDays(new Date(), 1),
  }));
}

export function getControlData(matchId) {
  const controlData = localStorage.getItem(`match-token.control-${matchId}`);

  try {
    return JSON.parse(controlData);
  } catch (error) {
    return null;
  }
}

export function removeControlData(matchId) {
  localStorage.removeItem(`match-token.control-${matchId}`);
}

export function removeSubscribeData(matchId) {
  localStorage.removeItem(`match-token.subscribe-${matchId}`);
}

export function getBrokerTopic(match) {
  if (match.brokerTopic) {
    return match.brokerTopic;
  }

  const subscribeData = localStorage.getItem(`match-token.subscribe-${match.id}`);

  try {
    const parsedData = JSON.parse(subscribeData);

    return parsedData.brokerTopic;
  } catch (error) {
    return null;
  }
}

export function getPublishToken(match) {
  try {
    const { publishToken } = getControlData(match.id);

    return publishToken;
  } catch (error) {
    return null;
  }
}
