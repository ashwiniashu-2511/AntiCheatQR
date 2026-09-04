package com.anticheatqr;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/QuestionServlet")
public class QuestionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // MySQL connection details
    private static final String URL =
            "jdbc:mysql://localhost:3307/anticheatqr";

    private static final String USER = "root";

    private static final String PASSWORD = "ashwiniudhaya";

    protected void doGet(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        HttpSession session = request.getSession();

        String participantId =
                (String) session.getAttribute("participantId");

        String participantName =
                (String) session.getAttribute("participantName");

        Object startTimeObject =
                session.getAttribute("startTime");

        // Check registration
        if (participantId == null || participantId.isEmpty()
                || startTimeObject == null) {

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Access Denied</title>" +
                "</head>" +
                "<body style='text-align:center;font-family:Arial;padding-top:80px;'>" +
                "<h1>🚫 Access Denied</h1>" +
                "<p>Please register before starting the event.</p>" +
                "</body>" +
                "</html>"
            );

            return;
        }

        long startTime = (Long) startTimeObject;

        response.getWriter().println(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<title>Question 1</title>" +
            "</head>" +

            "<body style='text-align:center;font-family:Arial;padding-top:50px;'>" +

            "<h1>🎯 Anti-Cheat QR Event</h1>" +

            "<h3>Welcome, " + participantName + "!</h3>" +

            "<p>Participant ID: <b>" +
            participantId +
            "</b></p>" +

            "<h2 id='timer' style='color:red;'>10:00</h2>" +

            "<hr>" +

            "<h2>Question 1</h2>" +

            "<p>What is the capital of Tamil Nadu?</p>" +

            "<form method='post' action='QuestionServlet'>" +

            "<input type='text' name='answer' " +
            "placeholder='Enter your answer' required>" +

            "<br><br>" +

            "<button type='submit'>Submit Answer</button>" +

            "</form>" +

            "<script>" +

            "let startTime = " + startTime + ";" +

            "let totalTime = 10 * 60 * 1000;" +

            "function updateTimer() {" +

            "let currentTime = new Date().getTime();" +

            "let elapsedTime = currentTime - startTime;" +

            "let remainingTime = totalTime - elapsedTime;" +

            "if (remainingTime <= 0) {" +

            "document.getElementById('timer').innerHTML = '⏰ TIME UP!';" +

            "window.location.href = 'ResultServlet';" +

            "return;" +

            "}" +

            "let totalSeconds = Math.floor(remainingTime / 1000);" +

            "let minutes = Math.floor(totalSeconds / 60);" +

            "let seconds = totalSeconds % 60;" +

            "seconds = seconds < 10 ? '0' + seconds : seconds;" +

            "document.getElementById('timer').innerHTML =" +

            "'⏱️ Time Remaining: ' + minutes + ':' + seconds;" +

            "}" +

            "updateTimer();" +

            "setInterval(updateTimer, 1000);" +

            "</script>" +

            "</body>" +
            "</html>"
        );
    }


    protected void doPost(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String answer = request.getParameter("answer");

        HttpSession session = request.getSession();

        response.setContentType("text/html;charset=UTF-8");

        String participantId =
                (String) session.getAttribute("participantId");


        // Check correct answer
        if (answer != null &&
                answer.trim().equalsIgnoreCase("Chennai")) {

            session.setAttribute("question1Completed", true);
            session.setAttribute("score", 10);


            // ==============================
            // UPDATE DATABASE
            // ==============================

            try {

                Class.forName("com.mysql.cj.jdbc.Driver");

                Connection connection =
                        DriverManager.getConnection(
                                URL,
                                USER,
                                PASSWORD
                        );

                String sql =
                        "UPDATE participants " +
                        "SET score = ?, status = ? " +
                        "WHERE participant_id = ?";

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                statement.setInt(1, 10);
                statement.setString(2, "Q1 Completed");
                statement.setString(3, participantId);

                statement.executeUpdate();

                statement.close();
                connection.close();


                // ==============================
                // SUCCESS PAGE
                // ==============================

                response.getWriter().println(

                    "<!DOCTYPE html>" +
                    "<html>" +

                    "<head>" +
                    "<meta charset='UTF-8'>" +
                    "<title>Question 1 Completed</title>" +
                    "</head>" +

                    "<body style='text-align:center;font-family:Arial;" +
                    "background:#f2f2f2;padding-top:70px;'>" +

                    "<div style='background:white;width:450px;margin:auto;" +
                    "padding:35px;border-radius:15px;" +
                    "box-shadow:0 0 15px #aaa;'>" +

                    "<h1>✅ Correct Answer!</h1>" +

                    "<h2>Question 1 Completed</h2>" +

                    "<p>Your answer is correct.</p>" +

                    "<h2>🏆 Current Score: 10</h2>" +

                    "<br>" +

                    "<h2>📍 Go to Station 2</h2>" +

                    "<p>Please find <b>QR Code 2</b> at Station 2.</p>" +

                    "<p>Scan QR Code 2 using your mobile phone " +
                    "to continue to Question 2.</p>" +

                    "<br>" +

                    "<div style='padding:15px;background:#f5f5f5;" +
                    "border-radius:10px;'>" +

                    "<b>🔐 Your next step:</b>" +

                    "<p>Go to Station 2 → Scan QR 2</p>" +

                    "</div>" +

                    "</div>" +

                    "</body>" +
                    "</html>"
                );

            } catch (Exception e) {

                response.getWriter().println(

                    "<h1>❌ Database Error</h1>" +
                    "<p>" + e.getMessage() + "</p>"

                );

                e.printStackTrace();
            }


        } else {

            response.getWriter().println(

                "<!DOCTYPE html>" +

                "<html>" +

                "<body style='text-align:center;font-family:Arial;" +
                "padding-top:80px;'>" +

                "<h1>❌ Wrong Answer!</h1>" +

                "<p>Please try again.</p>" +

                "<br>" +

                "<a href='QuestionServlet'>" +

                "<button style='padding:12px 25px;'>" +

                "Try Again" +

                "</button>" +

                "</a>" +

                "</body>" +

                "</html>"
            );
        }
    }
}