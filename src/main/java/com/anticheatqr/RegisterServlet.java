package com.anticheatqr;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // MySQL Database details
    private static final String URL =
            "jdbc:mysql://localhost:3307/anticheatqr";

    private static final String USER = "root";

    private static final String PASSWORD = "ashwiniudhaya";

    protected void doPost(HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String participantId = request.getParameter("participantId");

        response.setContentType("text/html;charset=UTF-8");

        try {

            // Connect to MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection connection =
                    DriverManager.getConnection(
                            URL,
                            USER,
                            PASSWORD
                    );

            // ---------------------------------
            // CHECK WHETHER PARTICIPANT EXISTS
            // ---------------------------------

            String checkSql =
                    "SELECT participant_name, score, status, start_time " +
                    "FROM participants " +
                    "WHERE participant_id = ?";

            PreparedStatement checkStatement =
                    connection.prepareStatement(checkSql);

            checkStatement.setString(1, participantId);

            ResultSet result =
                    checkStatement.executeQuery();

            String existingName = null;

            if (result.next()) {

                existingName =
                        result.getString("participant_name");

            }

            result.close();
            checkStatement.close();


            // ---------------------------------
            // IF PARTICIPANT ALREADY EXISTS
            // ---------------------------------

            if (existingName != null) {

                connection.close();

                HttpSession session =
                        request.getSession();

                session.setAttribute(
                        "participantName",
                        existingName
                );

                session.setAttribute(
                        "participantId",
                        participantId
                );

                // IMPORTANT:
                // Do not create a new start time
                // for an existing participant.

                response.getWriter().println(

                    "<!DOCTYPE html>" +
                    "<html>" +

                    "<head>" +
                    "<meta charset='UTF-8'>" +
                    "<title>Already Registered</title>" +
                    "</head>" +

                    "<body style='text-align:center;" +
                    "font-family:Arial;" +
                    "background:#f2f2f2;" +
                    "padding-top:70px;'>" +

                    "<div style='background:white;" +
                    "width:450px;" +
                    "margin:auto;" +
                    "padding:35px;" +
                    "border-radius:15px;" +
                    "box-shadow:0 0 15px #aaa;'>" +

                    "<h1>ℹ️ Already Registered</h1>" +

                    "<h2>Welcome Back!</h2>" +

                    "<p>Participant Name: <b>" +
                    existingName +
                    "</b></p>" +

                    "<p>Participant ID: <b>" +
                    participantId +
                    "</b></p>" +

                    "<br>" +

                    "<p>You are already registered.</p>" +

                    "<p>Please go to <b>Station 1</b>.</p>" +

                    "<p>Scan <b>QR Code 1</b> to continue.</p>" +

                    "</div>" +

                    "</body>" +
                    "</html>"
                );

                return;
            }


            // ---------------------------------
            // NEW PARTICIPANT
            // ---------------------------------

            long startTime =
                    System.currentTimeMillis();

            String insertSql =
                    "INSERT INTO participants " +
                    "(participant_id, participant_name, score, status, start_time) " +
                    "VALUES (?, ?, ?, ?, NOW())";

            PreparedStatement statement =
                    connection.prepareStatement(insertSql);

            statement.setString(1, participantId);
            statement.setString(2, name);
            statement.setInt(3, 0);
            statement.setString(4, "Registered");

            statement.executeUpdate();

            statement.close();
            connection.close();


            // ---------------------------------
            // SAVE DETAILS IN SESSION
            // ---------------------------------

            HttpSession session =
                    request.getSession();

            session.setAttribute(
                    "participantName",
                    name
            );

            session.setAttribute(
                    "participantId",
                    participantId
            );

            session.setAttribute(
                    "startTime",
                    startTime
            );

            session.setAttribute(
                    "question1Completed",
                    false
            );

            session.setAttribute(
                    "question2Completed",
                    false
            );

            session.setAttribute(
                    "question3Completed",
                    false
            );

            session.setAttribute(
                    "score",
                    0
            );


            // ---------------------------------
            // SUCCESS PAGE
            // ---------------------------------

            response.getWriter().println(

                "<!DOCTYPE html>" +
                "<html>" +

                "<head>" +
                "<meta charset='UTF-8'>" +
                "<title>Registration Successful</title>" +
                "</head>" +

                "<body style='text-align:center;" +
                "font-family:Arial;" +
                "background:#f2f2f2;" +
                "padding-top:70px;'>" +

                "<div style='background:white;" +
                "width:450px;" +
                "margin:auto;" +
                "padding:35px;" +
                "border-radius:15px;" +
                "box-shadow:0 0 15px #aaa;'>" +

                "<h1>✅ Registration Successful!</h1>" +

                "<h2>Welcome!</h2>" +

                "<p>Participant Name: <b>" +
                name +
                "</b></p>" +

                "<p>Participant ID: <b>" +
                participantId +
                "</b></p>" +

                "<br>" +

                "<p>Please go to <b>Station 1</b>.</p>" +

                "<p>Scan the QR Code displayed at Station 1 " +
                "to start the event.</p>" +

                "</div>" +

                "</body>" +
                "</html>"
            );

        } catch (Exception e) {

            response.setContentType(
                    "text/html;charset=UTF-8"
            );

            response.getWriter().println(

                "<h1>❌ Database Error</h1>" +
                "<p>" + e.getMessage() + "</p>"
            );

            e.printStackTrace();
        }
    }
}