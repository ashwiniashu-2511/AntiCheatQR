package com.anticheatqr;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/ResultServlet")
public class ResultServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();

        String name = (String) session.getAttribute("participantName");
        String participantId = (String) session.getAttribute("participantId");

        Integer score = (Integer) session.getAttribute("score");

        response.setContentType("text/html;charset=UTF-8");

        if (name == null || participantId == null) {

            response.getWriter().println(
                "<!DOCTYPE html>" +
                "<html><body style='text-align:center;font-family:Arial;padding-top:80px;'>" +
                "<h1>🚫 Access Denied</h1>" +
                "<p>Please register before viewing the result.</p>" +
                "</body></html>"
            );

            return;
        }

        if (score == null) {
            score = 0;
        }

        response.getWriter().println(
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<meta charset='UTF-8'>" +
            "<title>Event Result</title>" +
            "</head>" +

            "<body style='text-align:center;font-family:Arial;background:#f2f2f2;padding-top:60px;'>" +

            "<div style='background:white;width:450px;margin:auto;padding:35px;border-radius:15px;box-shadow:0 0 15px #aaa;'>" +

            "<h1>🏆 EVENT COMPLETED</h1>" +

            "<hr>" +

            "<h2>Congratulations!</h2>" +

            "<p>Participant Name: <b>" + name + "</b></p>" +

            "<p>Participant ID: <b>" + participantId + "</b></p>" +

            "<br>" +

            "<h2>📊 Your Score</h2>" +

            "<h1>" + score + " / 30</h1>" +

            "<p>🎉 Thank you for participating!</p>" +

            "</div>" +

            "</body>" +
            "</html>"
        );
    }
}