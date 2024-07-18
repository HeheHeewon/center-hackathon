package hello.hello_spring.entity;

import jakarta.persistence.*;

@Entity
public class NotificationGuide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String imageUrl;

    // getters and setters

}
