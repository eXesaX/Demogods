name := """demogods-server"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  ws,
  "com.typesafe.akka" %% "akka-persistence-experimental" % "2.3.9"
)