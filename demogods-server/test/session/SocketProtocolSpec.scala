package session

import java.util.UUID

import actors.session.PlayJsonSocketHelper
import actors.session.SocketProtocol._
import org.scalatest._

class SocketProtocolSpec extends FlatSpec with Matchers {

  val socketHelper = new PlayJsonSocketHelper {}

  def test(wsm: WebSocketMessage) = assert(wsm == socketHelper.fromJson(socketHelper.toJson(wsm)).get)


  "PlayJsonSocketHelper" should "correctly serialize FindGame" in {
    test(FindGame)
  }

  it should "correctly serialize ExitGame" in {
    test(ExitGame)
  }

  it should "correctly serialize StartGame" in {
    test(StartGame)
  }

  it should "correctly serialize ThrowCard" in {
    test(ThrowCard(UUID.randomUUID()))
  }

  it should "correctly serialize ApplyCreature" in {
    test(ApplyCreature(UUID.randomUUID(), UUID.randomUUID()))
  }

  it should "correctly serialize FinishTurn" in {
    test(FinishTurn)
  }

  it should "correctly serialize GameFound" in {
    test(GameFound("foo"))
  }

  it should "correctly serialize GamePaused" in {
    test(GamePaused)
  }

  it should "correctly serialize GameResumed" in {
    test(GameResumed)
  }

  it should "correctly serialize GameFinished" in {
    test(GameFinished)
  }

  it should "correctly serialize FirstPlayerSelected" in {
    test(FirstPlayerSelected(UUID.randomUUID()))
  }

  it should "correctly serialize CardPulled" in {
    test(CardPulled(UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCardThrown" in {
    test(EnemyCardThrown(UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCreatureApplied" in {
    test(EnemyCreatureApplied(UUID.randomUUID(), UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCardPulled" in {
    test(EnemyCardPulled)
  }

  it should "correctly serialize EnemyTurnFinished" in {
    test(EnemyTurnFinished)
  }

  it should "correctly serialize EnemyDisconnected" in {
    test(EnemyDisconnected)
  }

  it should "correctly serialize CreatureRaised" in {
    test(CreatureRaised(UUID.randomUUID(), UUID.randomUUID()))
  }

  it should "correctly serialize EnemyCreatureRaised" in {
    test(EnemyCreatureRaised(UUID.randomUUID(), UUID.randomUUID()))
  }

}