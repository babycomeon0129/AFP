import { animation, trigger, animateChild, group, transition, animate, style, query } from '@angular/animations';

export const transAnimation = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}')
]);

// Routable animations 換頁切換
export const slideInAnimation =
  trigger('routeAnimations', [
    transition( '* => *', [ style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], {optional: true}),
      query(':enter', [
        style({ left: '200%'})
      ], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('400ms ease-out', style({ left: '100%'}))
        ], {optional: true}),
        query(':enter', [
          animate('400ms ease-in-out', style({ left: '0%'}))
        ], {optional: true})
      ]),
      query(':enter', animateChild(), {optional: true}),
    ])
  ]);

// 同頁切換
export const layerAnimation =
trigger('layerTrigger', [
  transition(':enter', [
    style({position: 'absolute', left: '200%', opacity: '0.8'}),
    animate('400ms ease-in'), style({left: '0'})
  ]),
  transition(':leave', [
    style({position: 'absolute', left: '0', opacity: '0.8'}),
    animate('400ms ease-out', style({left: '200%'}))
  ])
]);
