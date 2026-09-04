package com.anticheatqr;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/Question2Servlet")
public class Question2Servlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();

        Boolean completed =
                (Boolean) session.getAttribute("question1Completed");

        Object startTimeObject =
                session.getAttribute("startTime");

        response.setContentType("text/html;charset=UTF-8");

        // Check Question 1 completed
        if (completed == null || !completed) {

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Access Denied</title>" +
                "</head>" +
                "<body style='text-align:center;font-family:Arial;padding-top:80px;'>" +
                "<h1>🚫 Access Denied</h1>" +
                "<p>You must complete Question 1 first.</p>" +
                "</body>" +
                "</html>"
            );

            return;
        }

        // Check registration timer
        if (startTimeObject == null) {

            response.sendRedirect("registration.html");

            return;
        }

        long startTime = (Long) startTimeObject;

        response.getWriter().println(
            "<!DOCTYPE html>" +
            "<html>" +

            "<head>" +
            "<meta charset='UTF-8'>" +
            "<title>Question 2</title>" +
            "</head>" +

            "<body style='text-align:center;font-family:Arial;padding-top:60px;'>" +

            "<h1>🔐 Anti-Cheat QR Event</h1>" +

            "<h2 id='timer' style='color:red;'>10:00</h2>" +

            "<h2>Question 2</h2>" +

            "<p>Which language is mainly used for Android development?</p>" +

            "<form method='post' action='Question2Servlet'>" +

            "<input type='text' " +
            "name='answer' " +
            "placeholder='Enter your answer' " +
            "required>" +

            "<br><br>" +

            "<button type='submit'>" +
            "Submit Answer" +
            "</button>" +

            "</form>" +

            "<script>" +

            "let startTime = " + startTime + ";" +

            "let totalTime = 10 * 60 * 1000;" +

            "function updateTimer() {" +

            "let currentTime = new Date().getTime();" +

            "let remainingTime = totalTime - (currentTime - startTime);" +

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


    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String answer = request.getParameter("answer");

        HttpSession session = request.getSession();

        Object startTimeObject =
                session.getAttribute("startTime");

        if (startTimeObject == null) {

            response.sendRedirect("registration.html");

            return;
        }

        response.setContentType("text/html;charset=UTF-8");

        if (answer != null &&
                answer.trim().equalsIgnoreCase("Java")) {

            session.setAttribute("question2Completed", true);

            session.setAttribute("score", 20);

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html>" +

                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Question 2 Completed</title>" +
                "</head>" +

                "<body style='text-align:center;font-family:Arial;" +
                "background:#f2f2f2;padding-top:70px;'>" +

                "<div style='background:white;width:450px;margin:auto;" +
                "padding:35px;border-radius:15px;" +
                "box-shadow:0 0 15px #aaa;'>" +

                "<h1>✅ Correct Answer!</h1>" +

                "<h2>Question 2 Completed</h2>" +

                "<p>Your answer is correct.</p>" +

                "<br>" +

                "<h2>📍 Go to Station 3</h2>" +

                "<p>Please find <b>QR Code 3</b> at Station 3.</p>" +

                "<p>Scan QR Code 3 using your mobile phone " +
                "to continue to Question 3.</p>" +

                "<br>" +

                "<div style='padding:15px;background:#f5f5f5;" +
                "border-radius:10px;'>" +

                "<b>🔐 Your next step:</b>" +

                "<p>Go to Station 3 → Scan QR 3</p>" +

                "</div>" +

                "</div>" +

                "</body>" +

                "</html>"
            );

        } else {

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html>" +

                "<body style='text-align:center;font-family:Arial;" +
                "padding-top:80px;'>" +

                "<h1>❌ Wrong Answer!</h1>" +

                "<p>Please try again.</p>" +

                "<br>" +

                "<a href='Question2Servlet'>" +

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