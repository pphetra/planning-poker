window.App = Ember.Application.create();

App.Player = Ember.Object.extend({
    name: null,
    card: null,
    cardView: null,
    flip: false
});

App.matchController = Ember.Object.create({
    players: {},

    addPlayer: function(player) {
        if (! player.cardView) {
            player.cardView = App.PlayerView.create({
                player: player
            });
        }
        App.matchView.addPlayerView(player.cardView);
        this.get('players')[player.name] = player;
        this.notifyPropertyChange('players');
    }
});

App.PlayerView = Ember.View.extend({
    templateName: 'playerView',
    cardClass: function() {
        return "face back card" + this.get('player').get('card');
    }.property('player.card'),

    containerClass: function() {
        var base = "container poker";
        if (this.get('player').get('flip')) {
            base += ' flip';
        }
        return base;
    }.property('player.flip'),

    player: null
});

App.matchView = Ember.ContainerView.create({
    addPlayerView: function(view) {
        this.get('childViews').pushObject(view);
    }
});

App.matchView.appendTo('#play-area');


var socket = io.connect('http://localhost');
socket.on('newPlayer', function (data) {
    var card = data.card ? data.card : 0;
    var player = App.matchController.players[data.name];
    if (! player) {
        player = App.Player.create({name:data.name, card:card, flip: false});
        App.matchController.addPlayer(player);
    } else {
        player.set('card', card);
        player.set('flip', false);
    }
});

socket.on('setCard', function(data) {
    App.matchController.players[data.name].set('card', data.card);
});

socket.on('flip', function(data) {
    var player = App.matchController.players[data.name];
    if (player) {
        player.set('card', data.card);
        player.set('flip', true);
    }
});