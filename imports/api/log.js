
function usersReady(game, log) {
  log.push({time: game.created, event: 'created'});
  if(game.creator && game.creator.ready &&
    game.challenger && game.challenger.ready) {
    if(game.creator.ready_at <= game.challenger.ready_at) {
      log.push({time: game.creator.ready_at, event: 'creator ready'});
      log.push({time: game.challenger.ready_at, event: 'challenger ready'});
    } else {
      log.push({time: game.challenger.ready_at, event: 'challenger ready'});
      log.push({time: game.creator.ready_at, event: 'creator ready'});
    }
  } else if (game.creator && game.creator.ready){
    log.push({time: game.creator.ready_at, event: 'creator ready'});
  } else if (game.challenger && game.challenger.ready){
    log.push({time: game.challenger.ready_at, event: 'challenger ready'});
  }
}

export function getLog(game) {
  const log = [];
  if (typeof game.created != 'undefined') {
    usersReady(game, log);
  }
  return log;
}
