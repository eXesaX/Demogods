package controllers

import actors.matchMaking.UserMatchFinder
import play.api.mvc._
import play.api.Play.current
import play.api.libs.json._
import actors.Actors._

object Login extends Controller {

  def findMatch(userId: String) = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    UserMatchFinder.props(userId, out, matchMaker)
  }
}