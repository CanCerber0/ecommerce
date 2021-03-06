import { UserService } from './../../services/user.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart';
import { LikeResponse } from 'src/app/models/like';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: CartModelServer;
  likeData: LikeResponse;
  cartTotalPeso: number;
  cartTotalUsd: number;
  authState: boolean;

  constructor( 
    public cartSvc: CartService, 
    private userSvc: UserService,
    private zone: NgZone) { }

  ngOnInit(): void {
    this.cartSvc.cartTotalPeso$.subscribe( total => this.cartTotalPeso = total);
    this.cartSvc.cartTotalUsd$.subscribe( total => this.cartTotalUsd = total);
    this.cartSvc.cartData$.subscribe(data=> this.cartData = data);
    this.cartSvc.likeData$.subscribe(like=> this.likeData = like);

    this.userSvc.authStatus$.subscribe(authStatus$ => this.authState = authStatus$)
  }

}
