package com.anticheatqr;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/Question3Servlet")
public class Question3Servlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();

        Boolean completed =
                (Boolean) session.getAttribute("question2Completed");

        Object startTimeObject =
                session.getAttribute("startTime");

        response.setContentType("text/html;charset=UTF-8");

        // Check Question 2 completed
        if (completed == null || !completed) {

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Access Denied</title>" +
                "</head>" +

                "<body style='text-align:center;" +
                "font-family:Arial;padding-top:80px;'>" +

                "<h1>🚫 Access Denied</h1>" +

                "<p>You must complete Question 2 first.</p>" +

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
            "<title>Question 3</title>" +
            "</head>" +

            "<body style='text-align:center;" +
            "font-family:Arial;background:#f2f2f2;" +
            "padding-top:60px;'>" +

            "<div style='background:white;width:450px;" +
            "margin:auto;padding:30px;border-radius:15px;" +
            "box-shadow:0 0 15px #aaa;'>" +

            "<h1>🔐 Anti-Cheat QR Event</h1>" +

            "<h2 id='timer' style='color:red;'>10:00</h2>" +

            "<h2>Question 3</h2>" +

            "<p>Which planet is known as the Red Planet?</p>" +

            "<form method='post' action='Question3Servlet'>" +

            "<input type='text' " +
            "name='answer' " +
            "placeholder='Enter your answer' " +
            "required " +
            "style='padding:12px;width:80%;font-size:16px;'>" +

            "<br><br>" +

            "<button type='submit' " +
            "style='padding:12px 25px;font-size:16px;'>" +

            "Submit Answer" +

            "</button>" +

            "</form>" +

            "<script>" +

            "let startTime = " + startTime + ";" +

            "let totalTime = 10 * 60 * 1000;" +

            "function updateTimer() {" +

            "let currentTime = new Date().getTime();" +

            "let remainingTime = " +
            "totalTime - (currentTime - startTime);" +

            "if (remainingTime <= 0) {" +

            "document.getElementById('timer').innerHTML = " +
            "'⏰ TIME UP!';" +

            "window.location.href = 'ResultServlet';" +

            "return;" +

            "}" +

            "let totalSeconds = " +
            "Math.floor(remainingTime / 1000);" +

            "let minutes = " +
            "Math.floor(totalSeconds / 60);" +

            "let seconds = totalSeconds % 60;" +

            "seconds = seconds < 10 ? " +
            "'0' + seconds : seconds;" +

            "document.getElementById('timer').innerHTML = " +

            "'⏱️ Time Remaining: ' + " +
            "minutes + ':' + seconds;" +

            "}" +

            "updateTimer();" +

            "setInterval(updateTimer, 1000);" +

            "</script>" +

            "</div>" +

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
                answer.trim().equalsIgnoreCase("Mars")) {

            // Question 3 completed
            session.setAttribute("question3Completed", true);

            session.setAttribute("score", 30);

            response.sendRedirect("ResultServlet");

        } else {

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html>" +

                "<body style='text-align:center;" +
                "font-family:Arial;padding-top:80px;'>" +

                "<h1>❌ Wrong Answer!</h1>" +

                "<p>Please try again.</p>" +

                "<br>" +

                "<a href='Question3Servlet'>" +

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